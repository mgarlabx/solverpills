import App from './script_app.js';

const Editor = {

    // https://pyodide.org/

    obj: null,
    pyodide: null,
    lessons: null,
    pyodide: null,

    async load() {
        Z.hide('#editor-console-container');
        Editor.obj = CodeMirror.fromTextArea(Z.get('#editor-code'), { 
            lineNumbers: true,
            mode: "python"
        });
        fetch('https://solvertank.tech/solverpills/lessons/').then(response => response.json()).then(data => {
            let lastChapter = '';
            data.forEach((lesson, index) => {
                if (lesson.chapter !== lastChapter) {
                    lastChapter = lesson.chapter;
                    const option = document.createElement('option');
                    option.value = -1;
                    option.text = lesson.chapter.toUpperCase().replace('_', ' ').replace('0', '');
                    option.disabled = true;
                    Z.get('#editor-lessons').appendChild(option);
                }
                const option = document.createElement('option');
                option.value = index;
                option.text = `...${lesson.lesson.replace('.py', '').replace('_', ' ').replace('0', '')}`;
                Z.get('#editor-lessons').appendChild(option);
            });
            Editor.lessons = data;
        });

        Editor.pyodide = await loadPyodide(); 
        await Editor.pyodide.loadPackage(['pandas', 'pyodide-http', 'micropip']);
        const micropip = Editor.pyodide.pyimport('micropip');
        await micropip.install('requests');
        console.log = message => Z.get('#editor-console').innerHTML += message + '<br>'; // run first time
        Z.show('#editor-console-container');

    },

    select(index) {
        const lesson = Editor.lessons[index];
        Editor.obj.setValue(lesson.content);
        Z.html('#editor-console', '');
        Z.html('#editor-help', '');
    },

    async run() {
        let code = Editor.obj.getValue();

        // Gambware to add pyodide-http when using pd.read_*
        if (code.indexOf('pd.read_') > -1) {
            code = 'import pyodide_http\npyodide_http.patch_all()\n' + code;
        }
        
        Z.html('#editor-console', '');
        Z.html('#editor-help', '');
        Z.processing.show();
        try {
            await Editor.pyodide.runPythonAsync(code);
            Z.processing.hide();
        } catch (error) {
            Z.processing.hide();
            const messages = error.message.split(',');
            const lastMessage = messages[messages.length - 1];
            console.log(lastMessage);
        }
        console.log = message => Z.get('#editor-console').innerHTML += message + '<br>';
    },

    new() {
        Editor.obj.setValue('');
        Z.html('#editor-console', '');
        Z.html('#editor-code', '');
        Z.html('#editor-help', '');
    },

    help() {
        const path = 'https://bc2e4a52uz3ip3wtmiteus4kfm0ieuog.lambda-url.us-west-2.on.aws/'; // please, change this to your own API.AI endpoint
        const body = {
            language: App.obj.language,
            code: Editor.obj.getValue(),
            console: Z.get('#editor-console').textContent
        }
        Z.processing.show();
        fetch(path + 'support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json()).then(data => {
            Z.processing.hide();
            let comment = data.comment;
            comment = marked.parse(comment); // https://github.com/markedjs/marked
            comment = comment.replace(/<a /g, '<a target="_blank" ');
            Z.html('#editor-help', comment);
        });

    },
};

export default Editor;
