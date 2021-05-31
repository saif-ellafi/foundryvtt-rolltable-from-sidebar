Hooks.on("renderRollTableDirectory", (rolltables, html, data) => {
    const tables = html.find(".entity.table")
    tables.each((k) => {
        let rollIcon = document.createElement("a");
        rollIcon.classList.add("roll-table");
        rollIcon.setAttribute("data-action", "roll-table");
        rollIcon.setAttribute("title", game.i18n.localize("RollTableFromSidebar.Roll"));
        // Create roll icon
        let die = document.createElement("i");
        die.classList.add("fas");
        die.classList.add("fa-dice");
        rollIcon.appendChild(die);
        tables[k].appendChild(rollIcon);
        rollIcon.addEventListener("click", RollTableFromSidebar)
    });
});

function RollTableFromSidebar(event) {
    const tableId = event.currentTarget.parentElement.dataset["entityId"];
    const table = game.tables.get(tableId);
    table.draw();
}