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
let currentCommand = '';
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

function addNewPrompt() {
    const newPrompt = document.createElement('div');
    newPrompt.className = 'prompt';
    newPrompt.id = 'prompt';
    newPrompt.innerHTML = `user@portfolio:~$ <span class="command" id="command-text"></span>`;
    outputDiv.appendChild(newPrompt);
    promptDiv.remove();
    promptDiv = newPrompt;
    commandText = newPrompt.querySelector('#command-text');
    currentCommand = '';
    commandInput.focus();
    terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(cmd) {
    if (!cmd) {
        addNewPrompt();
        return;
    }

    // Append the executed command as a prompt
    const promptClone = document.createElement('div');
    promptClone.className = 'prompt';
    promptClone.textContent = `user@portfolio:~$ ${cmd}`;
    outputDiv.appendChild(promptClone);

    if (cmd in commands) {
        if (cmd === 'clear') {
            outputDiv.innerHTML = '';
            const welcome = document.getElementById('welcome').cloneNode(true);
            welcome.classList.add('active');
            outputDiv.appendChild(welcome);
            addNewPrompt();
        } else {
            typeCommand(cmd, () => {
                showSection(cmd);
                addNewPrompt();
            });
        }
    } else {
        typeCommand(cmd, () => {
            const error = document.createElement('p');
            error.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
            outputDiv.appendChild(error);
            addNewPrompt();
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (isTyping) return;

    if (e.key === 'Enter') {
        handleCommand(currentCommand.trim().toLowerCase());
    } else if (e.key === 'Backspace') {
        currentCommand = currentCommand.slice(0, -1);
        commandText.textContent = currentCommand;
        commandInput.value = currentCommand;
    } else if (e.key.length === 1) {
        currentCommand += e.key;
        commandText.textContent = currentCommand;
        commandInput.value = currentCommand;
    }
});

document.addEventListener('click', () => {
    commandInput.focus();
});

commandInput.addEventListener('input', () => {
    currentCommand = commandInput.value;
    commandText.textContent = currentCommand;
});

typeCommand('welcome', () => {
    document.getElementById('welcome').classList.add('active');
    commandInput.focus();
});
