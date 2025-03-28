# SummaFlash

# AI Tools for Google Docs Add-on

## Overview
The **AI Tools for Google Docs** add-on enhances productivity by leveraging AI to **summarize notes**, **generate key points**, and **create flashcards** from documents. It integrates with **OpenRouter AI** to process text and extract key insights.

## Features
- **Summarize Notes**: Generates a structured summary of the document and appends it to a new page.
- **Generate Key Points**: Extracts key takeaways from the document.
- **Create Flashcards**: Converts document content into a Q&A format and saves it in a Google Sheets file.

## Installation
1. Open **Google Docs**.
2. Click on **Extensions > Add-ons > Get add-ons**.
3. Search for **AI Tools for Google Docs**.
4. Click **Install** and follow the authorization process.

## Usage
1. Open a Google Docs document.
2. Click on **Extensions > AI Tools**.
3. Select one of the following:
   - **Summarize Notes** → Generates a summary on a new page.
   - **Generate Key Points** → Extracts and lists key points.
   - **Generate Flashcards** → Saves Q&A-style flashcards to Google Sheets.

## Setup & API Key
To enable AI functionalities, the add-on requires an **OpenRouter API key**:
1. Go to [OpenRouter](https://openrouter.ai) and sign up.
2. Retrieve your API key from your dashboard.
3. Store the API key using `PropertiesService` inside Google Apps Script:
   ```javascript
   PropertiesService.getScriptProperties().setProperty("OPENROUTER_API_KEY", "your-api-key-here");
   ```

## Permissions Required
- **Google Docs**: Read document content and append summaries.
- **Google Sheets**: Create and modify spreadsheets for flashcards.
- **External API Access**: Send document content to OpenRouter for processing.

## Privacy Policy
This add-on does not store or share your document data. The AI processing occurs in real-time, and no data is retained after generating summaries or flashcards.

## License
This project is licensed under the MIT License. Feel free to modify and distribute as needed.

## Support & Feedback
For issues, feature requests, or contributions, visit [GitHub Repository](https://github.com/Milleys/SummaFlash) or email **johnwilsonlorin1@gmail.com**.

