const accordionItems = [
  {
    title: "Database",
    commands: [
      { description: "Create a new migration file", command: "db:migrate" },
      {
        description: "List the status of all migrations",
        command: "db:migrate:status"
      },
      { description: "Undo the last migration", command: "db:migrate:undo" },
      { description: "Undo all migrations", command: "db:migrate:undo:all" },
      { description: "Create the database", command: "db:create" },
      { description: "Drop the database", command: "db:drop" }
    ]
  },
  {
    title: "Seed",
    commands: [
      { description: "Run specific seed file", command: "db:seed" },
      { description: "Run all seed files", command: "db:seed:all" },
      { description: "Undo specific seed file", command: "db:seed:undo" },
      { description: "Undo all seed files", command: "db:seed:undo:all" }
    ]
  },
  {
    title: "Init",
    commands: [
      { description: "Initialize Sequelize", command: "init" },
      { description: "Initialize configuration", command: "init:config" },
      { description: "Initialize migrations", command: "init:migrations" },
      { description: "Initialize models", command: "init:models" },
      { description: "Initialize seeders", command: "init:seeders" }
    ]
  },
  {
    title: "Migration",
    commands: [
      {
        description: "Generate a new migration",
        command: "migration:generate"
      },
      { description: "Create a new migration", command: "migration:create" }
    ]
  },
  {
    title: "Model",
    commands: [
      { description: "Generate a new model", command: "model:generate" },
      { description: "Create a new model", command: "model:create" }
    ]
  },
  {
    title: "Seed Create",
    commands: [
      { description: "Generate a new seed file", command: "seed:generate" },
      { description: "Create a new seed file", command: "seed:create" }
    ]
  }
];

const commandsAccordion = document.getElementById("commandsAccordion");

accordionItems.forEach((item, index) => {
  const accordionItem = document.createElement("div");
  accordionItem.className = "accordion-item";

  const headerId = `heading${index}`;
  const collapseId = `collapse${index}`;

  accordionItem.innerHTML = `
		<h2 class="accordion-header" id="${headerId}">
			<button class="accordion-button ${index !== 0 ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
				${item.title}
			</button>
		</h2>
		<div id="${collapseId}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" data-bs-parent="#commandsAccordion">
			<div class="accordion-body">
				${item.commands
          .map(
            (command) => `
					<button class="btn btn-primary btn-sm mb-1 command-btn" data-description="${command.description}" data-command="${command.command}">${command.command}</button>
				`
          )
          .join("")}
			</div>
		</div>
	`;

  commandsAccordion.appendChild(accordionItem);
});

// listen event open accordion, after save to local storage
commandsAccordion.addEventListener("shown.bs.collapse", (e) => {
  const activeAccordion = e.target.id;
  localStorage.setItem("activeAccordion", activeAccordion);
});

// close
commandsAccordion.addEventListener("hidden.bs.collapse", (e) => {
  localStorage.removeItem("activeAccordion");
});

// open accordion after reload page
const activeAccordion = localStorage.getItem("activeAccordion");
if (activeAccordion) {
  const accordion = document.getElementById(activeAccordion);
  const accordionCollapse = new bootstrap.Collapse(accordion);
  accordionCollapse.show();
}
