#!/bin/bash

if [ -z "$GROQ" ]; then
    echo "Error: GROQ environment variable is not set"
    exit 1
fi

# Check if required commands exist
for cmd in pw-record curl jq xclip; do
    if ! command -v $cmd &> /dev/null; then
        echo "Error: $cmd is not installed"
        exit 1
    fi
done

# Create temporary audio file
TEMP_AUDIO=$(mktemp --suffix=.wav)
trap 'rm -f $TEMP_AUDIO' EXIT

echo "Recording... Press Enter to stop."
pw-record "$TEMP_AUDIO" &
RECORD_PID=$!

# Wait for Enter key
read

# Stop recording
kill $RECORD_PID
wait $RECORD_PID 2>/dev/null

echo "Transcribing audio..."
RESPONSE=$(curl -s https://api.groq.com/openai/v1/audio/transcriptions \
    -H "Authorization: bearer ${GROQ}" \
    -F "file=@${TEMP_AUDIO}" \
    -F "model=whisper-large-v3" \
    -F "temperature=0" \
    -F "response_format=json" \
    -F "language=en")

# Extract the transcribed text from the JSON response and copy to clipboard
TEXT=$(echo "$RESPONSE" | jq -r '.text // empty')

if [ -z "$TEXT" ]; then
    echo "Error: Failed to get transcription"
    echo "API Response: $RESPONSE"
    exit 1
fi

# Copy the text directly to clipboard and also print it
printf "%s" "$TEXT" | xclip -selection clipboard
echo "Transcribed text: $TEXT"
echo "Text copied to clipboard!"