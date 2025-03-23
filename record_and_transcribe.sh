#!/bin/bash

# Check command line arguments
TRANSCRIBE_CLIPBOARD=false
while getopts "c" opt; do
    case $opt in
        c) TRANSCRIBE_CLIPBOARD=true ;;
        *) echo "Usage: $0 [-c] (use -c to transcribe from clipboard)" >&2
           exit 1 ;;
    esac
done

# Check for required environment variables
if [ -z "$GROQ" ] || [ -z "$G" ]; then
    echo "Error: GROQ or G environment variables are not set"
    exit 1
fi

if [ "$TRANSCRIBE_CLIPBOARD" = true ]; then
    # Get text from clipboard
    TEXT=$(xclip -o -selection clipboard)
    if [ -z "$TEXT" ]; then
        echo "Error: Clipboard is empty"
        exit 1
    fi
    echo "Text from clipboard: $TEXT"
else
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

    # Extract the transcribed text from the JSON response
    TEXT=$(echo "$RESPONSE" | jq -r '.text // empty')
    if [ -z "$TEXT" ]; then
        echo "Error: Failed to get transcription"
        echo "API Response: $RESPONSE"
        exit 1
    fi

    echo "Transcribed text: $TEXT"
fi

# Send to Gemini API and get response
echo -e "\nGetting response from Gemini..."
CHAT_RESPONSE=$(curl -s "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${G}" \
    -d "{\"contents\":[{\"parts\":[{\"text\":\"$TEXT\"}]}]}")

# Extract the response text from Gemini's JSON response
GEMINI_TEXT=$(echo "$CHAT_RESPONSE" | jq -r '.candidates[0].content.parts[0].text // empty')
if [ -z "$GEMINI_TEXT" ]; then
    echo "Error: Failed to get Gemini response"
    echo "API Response: $CHAT_RESPONSE"
    exit 1
fi

echo -e "\nGemini response: $GEMINI_TEXT"

# Copy Gemini's response to clipboard
printf "%s" "$GEMINI_TEXT" | xclip -selection clipboard
echo -e "\nResponse copied to clipboard!"