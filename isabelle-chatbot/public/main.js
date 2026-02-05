// isabelle dialogue bubble javascript

Vue.config.devtools = true;

Vue.component("dialogue", {
  template: "#dialogue"
});

Vue.component("dialogue-text", {
  template: "#dialogue-text",
  data() {
    return {
      text: "",
      displayedText: ""
    };
  },
  created() {
    this.text = this.$slots.default[0].text;
  },
  mounted() {
    const speed = 25;
    const delay = 2000;
    let i = 0;

    const typewriter = () => {
      if (i < this.text.length) {
        this.displayedText += this.text.charAt(i);
        i++;
        setTimeout(typewriter, speed);
      }
    };

    setTimeout(typewriter, delay);
  }
});

const app = new Vue({
  el: "#app",
  mounted() {
    setTimeout(() => {
      this.$refs.audio.play();
    }, 2000);
  }
});

// town bulletin board task list javascript

const taskInput = document.getElementById("task");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

window.addEventListener("load", loadTasks);  // Load saved tasks when page opens

addTaskBtn.addEventListener("click", () => {
  console.log("clicked")
  const text = taskInput.value.trim();
  if (!text) return;

  createTask(text, false);
  saveTasks();
  taskInput.value = "";
});

function createTask(text, completed) {
  const li = document.createElement("li");
  li.className = "task-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const span = document.createElement("span");
  span.textContent = text;
  if (completed) span.classList.add("completed");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";

  checkbox.addEventListener("change", () => { // Toggle completed
    span.classList.toggle("completed");
    saveTasks();
  });

  deleteBtn.addEventListener("click", () => { // Delete task
    li.remove();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}


function saveTasks() {
  const tasks = [];

  document.querySelectorAll(".task-item").forEach(item => {
    const text = item.querySelector("span").textContent;
    const completed = item.querySelector("input").checked;
    tasks.push({ text, completed });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTask(task.text, task.completed));
}

// linking the backend to the frontend for the actual chatbot part

const input = document.getElementById('user-input');  // DOM elements
const button = document.getElementById('fetch-data');
const result = document.getElementById('result');

button.addEventListener("click", sendMessage);  // Event listener

async function sendMessage() {
  const message = input.value.trim(); //removes extra spaces

  if (!message) return; //prevents empty messages being sent out

  result.textContent += "\nYou: " + message + "\n"; //need to make chat bubbles for user with user pfp

  input.value = "";

  try {
    const response = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });

    // const reply = await response.text();
    const reply = "I’m just a test response for now! 🌸";

    // Show AI reply
    result.textContent += "Isabelle says: " + reply + "\n";
  } catch (err) {
    console.error(err);
    result.textContent += "Error talking to server.\n";
  }
}

//to test, in cd server run node server.js and for the frontend: in cd public run live-server