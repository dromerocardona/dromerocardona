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
const commandInput = document.getElementById('command-input');
let isTyping = false;

function typeCommand(text, callback) {
    isTyping = true;
    let i = 0;
    commandInput.value = '';
    function type() {
        if (i < text.length) {
            commandInput.value += text.charAt(i);
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
    if (!cmd) {
        addNewPrompt();
        return;
    }

    // Clone and append the current prompt with the command
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

function addNewPrompt() {
    // Create a new prompt and replace the old one
    const newPrompt = document.createElement('div');
    newPrompt.className = 'prompt';
    newPrompt.id = 'prompt';
    newPrompt.innerHTML = `user@portfolio:~$ <input type="text" id="command-input" autocomplete="off" autofocus>`;
    outputDiv.appendChild(newPrompt);
    promptDiv.remove();
    promptDiv = newPrompt;
    commandInput = newPrompt.querySelector('#command-input');
    commandInput.focus();

    // Re-attach event listeners to the new input
    commandInput.addEventListener('keydown', handleKeydown);
    terminal.scrollTop = terminal.scrollHeight;
}

function handleKeydown(e) {
    if (isTyping) return;
    if (e.key === 'Enter') {
        const cmd = commandInput.value.trim().toLowerCase();
        commandInput.value = '';
        handleCommand(cmd);
    }
}

commandInput.addEventListener('keydown', handleKeydown);

document.addEventListener('click', () => {
    commandInput.focus();
});

typeCommand('welcome', () => {
    document.getElementById('welcome').classList.add('active');
    commandInput.focus();
});
