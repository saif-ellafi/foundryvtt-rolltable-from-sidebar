Hooks.on("renderRollTableDirectory", (rolltables, html, data) => {
    const tables = html.find(".directory-item.document")
    tables.each((k) => {
        let rollIcon = document.createElement("a");
        enrichRollTableSidebar(rollIcon, tables, k);
        rollIcon.addEventListener("click", rollTableFromSidebar)
    });
    const folders = html.find(".folder-header")
    folders.each((k) => {
        let rollIcon = document.createElement("a");
        enrichRollTableSidebar(rollIcon, folders, k);
        rollIcon.addEventListener("click", rollTableFromFolder)
    });
});

Hooks.on("renderCompendium", (rolltables, html, data) => {
    if (data.collection.metadata.type !== 'RollTable')
        return;
    const tables = html.find(".directory-item.document")
    tables.each((k) => {
        let rollIcon = document.createElement("a");
        enrichRollTableSidebar(rollIcon, tables, k);
        rollIcon.addEventListener("click", (event) => rollTableFromCompendium(event, `${data.collection.metadata.packageName}.${data.collection.metadata.name}`))
    });
});

// Monk's Enhanced Journal Hook
Hooks.on('activateControls', (jn) => {
    const name = jn.constructor.name;
    if (name !== 'EnhancedJournal')
        return;
    jn.element.find(".content-link").contextmenu((elem) => {
        linkContextDraw(elem.currentTarget);
    });
});

Hooks.on('renderJournalTextPageSheet', (jn, element) => {
    const name = jn.constructor.name;
    // Consider support for OneJournal GMScreen and Monks Enhanced Journal
    if (!['JournalTextPageSheet'].includes(name))
        return;
    element.find(".content-link").contextmenu((elem) => {
        linkContextDraw(elem.currentTarget);
    });
})

function linkContextDraw(target) {
    if (target.getAttribute('data-pack')) {
        const pack = game.packs.get(target.getAttribute('data-pack'));
        if (pack?.metadata.type === 'RollTable') {
            pack.getDocuments().then(contents => {
                contents.find(t => t.id === target.getAttribute('data-id')).draw();
            })
        }
    } else if (target.getAttribute('data-type') === 'RollTable')
        game.tables.contents.find(t => t.id === target.getAttribute('data-id')).draw();
}

function enrichRollTableSidebar(rollIcon, tables, k) {
    rollIcon.classList.add("roll-table");
    rollIcon.setAttribute("data-action", "roll-table");
    rollIcon.setAttribute("title", game.i18n.localize("RollTableFromSidebar.Roll"));
    let die = document.createElement("i");
    die.classList.add("fas");
    die.classList.add("fa-dice");
    rollIcon.appendChild(die);
    tables[k].appendChild(rollIcon);
}

function rollTableFromSidebar(event) {
    const tableId = event.currentTarget.parentElement.dataset["documentId"];
    const table = game.tables.get(tableId);
    table.draw();
}

function rollTableFromCompendium(event, pack) {
    const tableId = event.currentTarget.parentElement.dataset["documentId"];
    game.packs.get(pack).getDocument(tableId).then(table => {
        table.draw();
    })
}

function rollTableFromFolder(event) {
    event.preventDefault();
    event.stopPropagation();
    let fid = event.target.parentElement.parentElement.parentElement.dataset.folderId;
    let tables = game.tables.contents.filter(t => t.folder?.id === fid);
    if (tables.length > 5) {
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