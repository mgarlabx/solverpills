import Editor from './script_editor.js';
import App from './script_app.js';

Z.ready(async () => {

    await Z.languageLoadDictionary('dictionary.json');
    
    App.load();
    Editor.load();

    window.editorRun = Editor.run;
    window.editorNew = Editor.new;
    window.editorHelp = Editor.help;
    window.editorSelect = Editor.select;

    

});

