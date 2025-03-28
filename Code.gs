function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu("AI Tools")
    .addSubMenu(ui.createMenu("Summarize Notes") // Creates a sub-menu
      .addItem("Append to the Document", "summarizeNotesDoc")
      .addItem("Render Outside the Document", "summarizeNotes")
      
    )
    .addSubMenu(ui.createMenu("Generate Keypoints") // Creates a sub-menu
      .addItem("Append to the Document", "createKeyPointsDoc")
      .addItem("Render Outside the Document", "createKeyPoints")
      
    )
    .addItem("Generate Flashcards", "generateFlashcardsWithOpenRouter")
    .addToUi();
}


function getApiKey() {
  return PropertiesService.getScriptProperties().getProperty("OPENROUTER_API_KEY");
}




function summarizeNotes() {
  var doc = DocumentApp.getActiveDocument();  
  var text = doc.getBody().getText();

  var summary = askOpenRouter("Summarize the following text in a concise and structured manner in paragraph form:\n Note: Respond in html format with your answer only\n" + text);

  var html = HtmlService.createHtmlOutput("<h3>Summary</h3><p>" + summary.replace(/```html|```json|```/g, "<br>") + "</p>")
      .setWidth(500)
      .setHeight(400);
  
  DocumentApp.getUi().showSidebar(html);
}


function summarizeNotesDoc() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var text = body.getText();

  // Get summary from OpenRouter
  var summary = askOpenRouter("Summarize the following text in a concise and structured manner in paragraph form:\n Note: Respond in plain text\n" + text);

  // Insert a page break before adding the summary
  body.appendPageBreak();
  
  // Add title for the summary
  body.appendParagraph("Summary").setHeading(DocumentApp.ParagraphHeading.HEADING1);

  // Add the summarized text
  body.appendParagraph(summary);

  Logger.log("Summary added to a new page.");
}


function createKeyPoints(){
  var doc = DocumentApp.getActiveDocument();  
  var text = doc.getBody().getText();

  var summary = askOpenRouter("Summarize the following text in a concise and structured manner. Extract the key points that are essential for studying, making them clear and easy to review:\n Note: Respond in html format\n" + text);

  var html = HtmlService.createHtmlOutput("<h3>Key Points</h3><p>" + summary.replace(/```html|```json|```/g, "<br>") + "</p>")
      .setWidth(500)
      .setHeight(400);
  
  DocumentApp.getUi().showSidebar(html);
}



function createKeyPointsDoc() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var text = body.getText();

  // Get summary from OpenRouter
  var summary = askOpenRouter("Summarize the following text in a concise and structured manner. Extract the key points that are essential for studying, making them clear and easy to review:\n Note: Respond in plain text\n" + text);

  // Insert a page break before adding the summary
  body.appendPageBreak();
  
  // Add title for the summary
  body.appendParagraph("Key Points").setHeading(DocumentApp.ParagraphHeading.HEADING1);

  // Add the summarized text
  body.appendParagraph(summary.replace(/\*\*|###/g, ""));

  Logger.log("Key Points added to a new page.");
}




function generateFlashcardsWithOpenRouter() {
  var doc = DocumentApp.getActiveDocument();  // Get active document
  var text = doc.getBody().getText();
  var docName = doc.getName();

  // Generate flashcards using OpenRouter
  var flashcards = askOpenRouter("Create flashcards in Q&A format from this text. Ensure that each flashcard follows the format:\n\nQ: [question]\nA: [answer]\n\nAvoid using Markdown formatting:\n\n" + text);

  // Create a new Google Sheets file
  var sheetFile = SpreadsheetApp.create(docName + " - Flashcards");
  var sheet = sheetFile.getActiveSheet();
  sheet.appendRow(["Question", "Answer"]); // Header row

  // Process flashcards into rows
  var rows = flashcards.split("\n").map(line => line.replace(/\*\*/g, "").trim()); // Remove bold markdown formatting

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].startsWith("Q:")) {
      var question = rows[i].replace("Q: ", "").trim();
      var answer = (rows[i + 1] && rows[i + 1].startsWith("A:")) ? rows[i + 1].replace("A: ", "").trim() : "";
      sheet.appendRow([question, answer]);
    }
  }

  Logger.log("Flashcards added to Google Sheets.");

  // Show a dialog with a clickable link to the sheet
  openSheetInNewTab(sheetFile);
}



// Open the newly created Google Sheet in a new tab
function openSheetInNewTab(sheetFile) {
  var url = sheetFile.getUrl();
  
  // Create an HTML output with a clickable link
  var html = HtmlService.createHtmlOutput(
    '<p>Click the link below to open your flashcards:</p>' +
    '<a href="' + url + '" target="_blank" onclick="google.script.host.close();">Open Flashcards</a>'
  ).setWidth(300).setHeight(150);

  DocumentApp.getUi().showModalDialog(html, "Flashcards Created!");
}



function askOpenRouter(prompt) {
  var apiKey = getApiKey();
  var url = "https://openrouter.ai/api/v1/chat/completions";

  var payload = {
    model: "deepseek/deepseek-chat-v3-0324:free",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  };

  var options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional
      "X-Title": "<YOUR_SITE_NAME>"      // Optional
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());

    if (!json.choices || json.choices.length === 0) {
      throw new Error("Invalid response from OpenRouter");
    }

    return json.choices[0].message.content;
  } catch (e) {
    Logger.log("Error with OpenRouter API: " + e.message);
    return "Error generating response. Please try again.";
  }
}

