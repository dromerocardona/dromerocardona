const commands = {
    about: 'about',
    projects: 'projects',
    interests: 'interests',
    work: 'work',
    help: 'help',
    clear: 'clear'
};

const terminal = document.getElementById('terminal');
const commandSpan = document.querySelector('.command');
const sections = document.querySelectorAll('.section');
let currentCommand = '';
let isTyping = false;

function typeCommand(text, callback) {
    isTyping = true;
    let i = 0;
    commandSpan.textContent = '';
    function type() {
        if (i < text.length) {
            commandSpan.textContent += text.charAt(i);
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
    sections.forEach(section => section.classList.remove('active'));
    if (sectionId !== 'clear') {
        document.getElementById(sectionId).classList.add('active');
        terminal.scrollTop = terminal.scrollHeight;
    } else {
        document.getElementById('welcome').classList.add('active');
    }
}

function handleCommand(cmd) {
    if (cmd in commands) {
        if (cmd === 'clear') {
            currentCommand = '';
            showSection('welcome');
            addPrompt();
        } else {
            typeCommand(cmd, () => {
                showSection(cmd);
                addPrompt();
            });
        }
    } else {
        typeCommand(cmd, () => {
            const output = document.createElement('p');
            output.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
            document.querySelector('.output').appendChild(output);
            addPrompt();
        });
    }
}

function addPrompt() {
    const newPrompt = document.createElement('div');
    newPrompt.className = 'prompt';
    newPrompt.innerHTML = `user@portfolio:~$ <span class="command"></span>`;
    document.querySelector('.output').appendChild(newPrompt);
    commandSpan = newPrompt.querySelector('.command');
    currentCommand = '';
    terminal.scrollTop = terminal.scrollHeight;
}

document.addEventListener('keydown', (e) => {
    if (isTyping) return;

    if (e.key === 'Enter') {
        handleCommand(currentCommand.trim().toLowerCase());
    } else if (e.key === 'Backspace') {
        currentCommand = currentCommand.slice(0, -1);
        commandSpan.textContent = currentCommand;
    } else if (e.key.length === 1) {
        currentCommand += e.key;
        commandSpan.textContent = currentCommand;
    }
});

typeCommand('welcome', () => showSection('welcome'));
