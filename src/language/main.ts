import { startLanguageServer } from 'langium';
import { NodeFileSystem } from 'langium/node';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { createCmakerServices, set_currently_highlighted_file, set_currently_opened_file } from './cmaker-module';
import { URI } from 'vscode-uri' 

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared } = createCmakerServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(shared);

connection.onDocumentHighlight((documentHighlightParams) => 
{
    if(documentHighlightParams)
    {
        let document_path = URI.parse(documentHighlightParams.textDocument.uri).fsPath;
        set_currently_highlighted_file(document_path)
    }
    else
    {
        set_currently_highlighted_file(undefined)
    }
    console.log("documentHighlightParams.textDocument.uri = "+URI.parse(documentHighlightParams.textDocument.uri).fsPath)
    return [];
});

connection.onDidOpenTextDocument((open_text_document) => 
{
    if(open_text_document)
    {
        let document_path = URI.parse(open_text_document.textDocument.uri).fsPath;
        set_currently_opened_file(document_path)
    }
    else
    {
        set_currently_opened_file(undefined)
    }
    return [];
});
