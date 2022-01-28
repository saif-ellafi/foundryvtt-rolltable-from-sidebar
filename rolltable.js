Hooks.on("renderRollTableDirectory", (rolltables, html, data) => {
    const tables = html.find(".directory-item.document")
    tables.each((k) => {
        let rollIcon = document.createElement("a");
        enrichRollTableSidebar(rollIcon, tables, k);
        rollIcon.addEventListener("click", RollTableFromSidebar)
    });
    const folders = html.find(".folder-header")
    folders.each((k) => {
        let rollIcon = document.createElement("a");
        enrichRollTableSidebar(rollIcon, folders, k);
        rollIcon.addEventListener("click", RollTableFromFolder)
    });
});

Hooks.on("renderCompendium", (rolltables, html, data) => {
    if (data.collection.metadata.type !== 'RollTable')
        return;
    const tables = html.find(".directory-item.document")
    tables.each((k) => {
        let rollIcon = document.createElement("a");
        enrichRollTableSidebar(rollIcon, tables, k);
        rollIcon.addEventListener("click", (event) => RollTableFromCompendium(event, `${data.collection.metadata.package}.${data.collection.metadata.name}`))
    });
});

function enrichRollTableSidebar(rollIcon, tables, k) {
    rollIcon.classList.add("roll-table");
    rollIcon.setAttribute("data-action", "roll-table");
    rollIcon.setAttribute("title", game.i18n.localize("RollTableFromSidebar.Roll"));
    let die = document.createElement("i");
    die.classList.add("fas");
    die.classList.add("fa-dice");
    rollIcon.appendChild(die);
    tables[k].appendChild(rollIcon);
};

function RollTableFromSidebar(event) {
    const tableId = event.currentTarget.parentElement.dataset["documentId"];
    const table = game.tables.get(tableId);
    table.draw();
}

function RollTableFromCompendium(event, pack) {
    const tableId = event.currentTarget.parentElement.dataset["documentId"];
    game.packs.get(pack).getDocument(tableId).then(table => {
        table.draw();
    })
}

function RollTableFromFolder(event) {
    event.preventDefault();
    event.stopPropagation();
    let fid = event.target.parentElement.parentElement.parentElement.dataset.folderId;
    let tables = game.tables.contents.filter(t => t.folder.id === fid);
    if (tables.length > 10) {
        let dialog = new Dialog({
            title: 'Warning',
            content: `<div>${game.i18n.localize("RollTableFromSidebar.Warning")}</div>`,
            buttons: {
                confirm: {
                    label: 'OK',
                    callback: () => {
                        tables.forEach(t => {
                            t.draw();
                        });
                    }
                },
                cancel: {
                    label: game.i18n.localize("RollTableFromSidebar.Cancel"),
                    callback: () => {}
                },
            },
            default: 'cancel'
        });
        dialog.render(true);
    } else {
        tables.forEach(t => {
            t.draw();
        });
    }
}