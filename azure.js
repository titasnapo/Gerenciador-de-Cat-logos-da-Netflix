const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "NetflixCatalog";
const containerId = "catalogo";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

module.exports = async function (context, req) {
    if (req.method === "POST") {
        const { titulo, genero, ano } = req.body;
        if (!titulo || !genero || !ano) {
            context.res = { status: 400, body: "Todos os campos são obrigatórios." };
            return;
        }

        const novoItem = { id: titulo, titulo, genero, ano };
        await container.items.create(novoItem);

        context.res = { status: 201, body: { message: "Catálogo adicionado!", item: novoItem } };
    } else if (req.method === "GET") {
        const { resources: catalogos } = await container.items.readAll().fetchAll();
        context.res = { status: 200, body: catalogos };
    } else {
        context.res = { status: 405, body: "Método não permitido." };
    }
};
