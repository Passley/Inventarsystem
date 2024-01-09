import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "projectdb"
})

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.json("Hello this is Backend")
})

app.get("/materials", (req,res)=>{
    const q = "SELECT * FROM materials"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/points", (req,res)=>{
    const q = "SELECT Punkte FROM lehrer WHERE Benutzername = 'TimFus4559'"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/materials", (req,res)=>{
    const q = "INSERT INTO materials (`image`, `title`, `description`, `ISBN`, `Kommentar`, `Anzahl`, `Ausgeliehen`, `Kategorie`, `Fach`, `Klassenstufe`, `Regal`, `AktuellePosition`, `link`) VALUES (?)"
    const values = [
      req.body.image,
      req.body.title,
      req.body.description, 
      req.body.ISBN, 
      req.body.Kommentar, 
      req.body.Anzahl,
      req.body.Ausgeliehen, 
      req.body.Kategorie, 
      req.body.Fach, 
      req.body.Klassenstufe,
      req.body.Regal,
      req.body.AktuellePosition,
      req.body.link
    ];

    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json("Material has been created")
    })
})

app.put('/materials/:id', (req, res) => {
    const materialId = req.params.id;
    const updatedMaterial = req.body;

    const q = `
        UPDATE materials
        SET
            image = ?,
            title = ?,
            description = ?,
            ISBN = ?,
            Kommentar = ?,
            Anzahl = ?,
            Ausgeliehen = ?,
            Kategorie = ?,
            Fach = ?,
            Klassenstufe = ?,
            Regal = ?,
            AktuellePosition = ?,
            link = ?
        WHERE id = ?
    `;

    const values = [
        updatedMaterial.image,
        updatedMaterial.title,
        updatedMaterial.description,
        updatedMaterial.ISBN,
        updatedMaterial.Kommentar,
        updatedMaterial.Anzahl,
        updatedMaterial.Ausgeliehen,
        updatedMaterial.Kategorie,
        updatedMaterial.Fach,
        updatedMaterial.Klassenstufe,
        updatedMaterial.Regal,
        updatedMaterial.AktuellePosition,
        updatedMaterial.link,
        materialId
    ];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            return res.status(200).json({ message: "Material has been updated" });
        });
    });

app.delete("/materials/:id", (req, res) => {
    const materialId = req.params.id;
    const q = "DELETE FROM materials WHERE id = ?";
    db.query(q, [materialId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Material has been deleted");
    });
});

app.get("/materials/:id", (req, res) => {
    const materialId = req.params.id;
    const q = "SELECT * FROM materials WHERE id = ?";
    db.query(q, [materialId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]);
    });
})

app.get("/countSchnellregal", (req, res) => {
    const q = "SELECT COUNT(*) AS schnellregalCount FROM materials WHERE AktuellePosition = 'Schnellregal'";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]);
    })
})

app.get("/teachers/:materialId", (req, res) => {
    const materialId = req.params.materialId;

    // Hier nehmen wir an, dass deine Tabelle mit ausgeliehenen Materialien "borrowed_materials" heißt.
    const q = `
        SELECT lehrer.*
        FROM lehrer
        JOIN ausgeliehen ON lehrer.ID = ausgeliehen.lehrer_id
        WHERE ausgeliehen.material_id = ?;
    `;

    db.query(q, [materialId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/schnellregal", (req, res) => {
    const q = "SELECT * FROM materials WHERE AktuellePosition = 'Schnellregal'";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get("/schnellregal/:id", (req, res) => {
    const materialId = req.params.id;
    const q = "SELECT * FROM materials WHERE id = ?";
    db.query(q, [materialId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]);
    });
})

app.get("/schnellregalItem/:id", (req, res) => {
    const materialId = req.params.id;
    const q = "SELECT * FROM ausgeliehen WHERE material_id = ?";
    db.query(q, [materialId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]);
    });
})


app.listen(8800, ()=>{
    console.log("Connected to backend!")
})