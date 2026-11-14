import { useEffect, useState } from 'react'
import './App.css'

const API = import.meta.env.vite_API_URL ?? "/api";

async function leerRespuesta(res: Response): Promise<string>{
  const body = await res.text();
  if (body.trim().startsWith("<")){
    throw new Error("El proxy no está llegando al gateway");

  }

  if(!res.ok){
    const legible = body && body.length < 200 && !body.startsWith("{");
    throw new Error(legible ? body : 'Error ${res.status}');

  }
  return body;
}

export default function App() {
  const [original, setOriginal] = useState("Cargando...");
  const [texto, setTexto] = useState("Cargando...");
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cargar = async () => {
    setError("");
    try {
      setTexto(await leerRespuesta(await fetch('${API}/saludo')));

    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const empezarEdicion = () => {
    setBorrador(texto);
    setError("");
    setEditando(true);
  };

  const guardar = async () => {
    setGuardando(true);
    setError("");
    try {
      const res = await fetch('${API}/saludo', {
        method: "PUT",
        headers: {"Content-Type": "text/plain; charset=utf-8" },
        body: borrador,
      });
      setTexto(await leerRespuesta(res));
      setEditando(false);

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="pagina">
      <section className="caja">
        <span className="etiqueta">Respuesta del API</span>

        {editando ? (
          <>
            <input
              className="entrada"
              value={borrador}
              maxLength={200}
              onChange={(e) => setBorrador(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guardar()}
              autoFocus
            />
            <div className="botones">
              <button onClick={guardar} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                className="secundario"
                onClick={() => setEditando(false)}
                disabled={guardando}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mensaje">{texto}</p>
            <div className="botones">
              <button onClick={empezarEdicion}>Editar</button>
              <button className="secundario" onClick={cargar}>
                Recargar del API
              </button>
            </div>
          </>
        )}

        {error && <small className="error">{error}</small>}
      </section>
    </main>
  );
}

