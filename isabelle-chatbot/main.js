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





const taskInput = document.getElementById("task");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

// Load saved tasks when page opens
window.addEventListener("load", loadTasks);

addTaskBtn.addEventListener("click", () => {
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

  // Toggle completed
  checkbox.addEventListener("change", () => {
    span.classList.toggle("completed");
    saveTasks();
  });

  // Delete task
  deleteBtn.addEventListener("click", () => {
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

