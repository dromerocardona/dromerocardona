const commands = {
    about: 'about',
    projects: 'projects',
    interests: 'interests',
    work: 'work',
    help: 'help',
    clear: 'clear'
};

const terminal = document.getElementById('terminal');
const outputDiv = document.getElementById('output');
const promptDiv = document.getElementById('prompt');
const commandText = document.getElementById('command-text');
const commandInput = document.getElementById('command-input');
let isTyping = false;

function typeCommand(text, callback) {
    isTyping = true;
    let i = 0;
    commandText.textContent = '';
    function type() {
        if (i < text.length) {
            commandText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        } else {
            isTyping = false;
            callback();
        }
    }
    type();
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    const clone = section.cloneNode(true);
    clone.classList.add('active');
    outputDiv.appendChild(clone);
    terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(cmd) {
    if (!cmd) return;
    const promptClone = promptDiv.cloneNode(true);
    promptClone.querySelector('#command-input').remove();
    promptClone.querySelector('#command-text').textContent = cmd;
    outputDiv.appendChild(promptClone);

    if (cmd in commands) {
        if (cmd === 'clear') {
            outputDiv.innerHTML = '';
            const welcome = document.getElementById('welcome').cloneNode(true);
            welcome.classList.add('active');
            outputDiv.appendChild(welcome);
        } else {
            typeCommand(cmd, () => {
                showSection(cmd);
            });
        }
    } else {
        typeCommand(cmd, () => {
            const error = document.createElement('p');
            error.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
            outputDiv.appendChild(error);
        });
    }
    terminal.scrollTop = terminal.scrollHeight;
}

commandInput.addEventListener('input', () => {
    commandText.textContent = commandInput.value;
});

commandInput.addEventListener('keydown', (e) => {
    if (isTyping) return;
    if (e.key === 'Enter') {
        const cmd = commandInput.value.trim().toLowerCase();
        commandInput.value = '';
        commandText.textContent = '';
        handleCommand(cmd);
    }
});

document.addEventListener('click', () => {
    commandInput.focus();
});

typeCommand('welcome', () => {
    document.getElementById('welcome').classList.add('active');
    commandInput.focus();
});
