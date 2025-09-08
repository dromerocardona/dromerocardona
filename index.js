const commands = {
    about: 'about',
    projects: 'projects',
    interests: 'interests',
    work: 'work',
    help: 'help',
    clear: 'clear',
};

const terminal = document.getElementById('terminal');
const outputDiv = document.getElementById('output');
let commandInput = document.getElementById('command-input');
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

function addNewPrompt() {
    // Remove the current prompt (with input) if it exists
    const currentPrompt = document.querySelector('.prompt:last-child');
    if (currentPrompt) {
        currentPrompt.remove();
    }

    // Create a new prompt with input field
    const newPrompt = document.createElement('div');
    newPrompt.className = 'prompt';
    newPrompt.innerHTML = `user@portfolio:~$ <input type="text" id="command-input" autocomplete="off" autofocus>`;
    outputDiv.appendChild(newPrompt);

    // Update commandInput reference
    commandInput = newPrompt.querySelector('#command-input');
    commandInput.focus();
    terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(cmd) {
    // Remove the current prompt to avoid duplication
    const currentPrompt = document.querySelector('.prompt:last-child');
    if (currentPrompt) {
        currentPrompt.remove();
    }

    // Append the typed command as a static prompt
    const promptClone = document.createElement('div');
    promptClone.className = 'prompt';
    promptClone.textContent = `user@portfolio:~$ ${cmd || ''}`;
    outputDiv.appendChild(promptClone);

    if (cmd == 'sudo rm -rf /') {
        location.href = 'https://pranx.com/bios/';
    }

    if (!cmd) {
        // For empty input, just add a new prompt
        addNewPrompt();
        return;
    }

    if (cmd in commands) {
        if (cmd === 'clear') {
            // Immediately reload the page to reset the entire interface
            location.reload();
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
        handleCommand(commandInput.value.trim().toLowerCase());
    }
});

document.addEventListener('click', () => {
    commandInput.focus();
});

// Initialize
document.getElementById('welcome').classList.add('active');
addNewPrompt();
