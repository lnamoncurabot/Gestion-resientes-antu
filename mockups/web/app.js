const state = {
  role: "administrador",
  view: "dashboard",
  residentId: 1,
  dashboardTab: "evolucion",
  pdfResidentId: 1,
  pdfPeriodDays: null,
  pdfEmail: "",
  pdfGenerated: false,
  pdfGeneratedResidentId: null,
  pdfGeneratedDays: null,
  powerBiDays: null
};

const $ = (id) => document.getElementById(id);

function init() {
  renderRoleSelect();
  $("roleSelect").addEventListener("change", (event) => {
    state.role = event.target.value;
    state.view = ROLES[state.role].menu[0][0];
    renderShell();
  });
  $("modalCancel").addEventListener("click", closeModal);
  $("modalConfirm").addEventListener("click", closeModal);
  $("logoutBtn").addEventListener("click", logout);
  renderShell();
}

function renderRoleSelect() {
  $("roleSelect").innerHTML = Object.entries(ROLES)
    .map(([key, role]) => `<option value="${key}">${role.label}</option>`)
    .join("");
  $("roleSelect").value = state.role;
}

function renderShell() {
  const role = ROLES[state.role];
  document.body.classList.toggle("admin-left-menu", state.role === "administrador" || state.role === "administrador_respaldo");
  $("roleBadge").innerHTML = `<strong>${role.label}</strong><span>${role.user}</span>`;
  $("menu").innerHTML = role.menu
    .map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-view="${id}">${label}</button>`)
    .join("");
  $("menu").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      renderShell();
    });
  });
  renderView();
}

function logout() {
  state.role = "administrador";
  state.view = ROLES[state.role].menu[0][0];
  state.residentId = 1;
  state.dashboardTab = "evolucion";
  state.pdfResidentId = 1;
  state.pdfPeriodDays = null;
  state.pdfEmail = "";
  state.pdfGenerated = false;
  state.pdfGeneratedResidentId = null;
  state.pdfGeneratedDays = null;
  state.powerBiDays = null;
  renderRoleSelect();
  renderShell();
  openModal("Sesión cerrada", "La maqueta volvió a la pantalla inicial. En la versión real este botón cerrará la sesión del usuario y volverá al login.");
}

function renderView() {
  const view = $("view");
  const map = {
    dashboard: renderAdminDashboard,
    inicio: renderInicio,
    residentes: renderResidentes,
    bdresidentes: renderBaseDatosResidentes,
    formularios: renderFormulariosAdmin,
    registros: renderRegistrosUsuarios,
    alertas: renderAlertas,
    rangos: renderRangos,
    usuarios: renderUsuarios,
    pdf: renderPdf,
    powerbi: renderPowerBi,
    formularioCam: renderFormularioCam,
    misRegistrosCam: renderMisRegistrosCam,
    formularioDt: () => renderFormularioProfesional("Directora Tecnica"),
    formularioEnfermero: () => renderFormularioProfesional("Enfermero"),
    dashboardResidente: renderDashboardResidente,
    misRegistrosProfesional: renderMisRegistrosProfesional,
    formularioNutri: renderFormularioNutri,
    misRegistrosNutri: renderMisRegistrosNutri
  };
  view.innerHTML = "";
  (map[state.view] || renderInicio)(view);
}

function page(title, text, action = "") {
  return `
    <div class="page-title">
      <div>
        <h1>${title}</h1>
        <p>${text}</p>
      </div>
      ${action}
    </div>
  `;
}

function metrics(items) {
  return `<div class="metrics">${items.map((item) => `
    <div class="metric"><strong>${item.value}</strong><span>${item.label}</span></div>
  `).join("")}</div>`;
}

function renderAdminDashboard(view) {
  const resident = selectedResident();
  view.innerHTML = page("Dashboard administrador", "Vista general del hogar, residentes activos, alertas y actividad de usuarios.") +
    metrics([
      { value: `${RESIDENTES.length}/18`, label: "Residentes activos" },
      { value: ALERTAS.length, label: "Alertas abiertas" },
      { value: "8", label: "Usuarios iniciales" },
      { value: "4", label: "Formularios operativos" }
    ]) +
    `<div class="notice">Administrador mantiene acceso a los controles de ciclos y sus graficas, igual que en el prototipo original.</div>` +
    residentSearchPanel() +
    residentProfile(resident) +
    bitacoraResidente(resident) +
    renderGraficasCam(resident) +
    `<div class="grid2">
      <div class="card">
        <h2>Accesos rapidos</h2>
        <div class="toolbar">
          <button class="btn primary" onclick="go('residentes')">Ver residentes</button>
          <button class="btn secondary" onclick="go('alertas')">Revisar alertas</button>
          <button class="btn secondary" onclick="go('rangos')">Editar rangos</button>
        </div>
      </div>
      <div class="card">
        <h2>Alertas del residente</h2>
        ${residentAlerts(resident)}
      </div>
    </div>`;
  attachResidentSearch();
}

function renderInicio(view) {
  const role = ROLES[state.role];
  const isCam = state.role === "cam";
  const isNutri = state.role === "nutricionista";
  view.innerHTML = page(`Panel ${role.label}`, "Pantalla inicial respetando los accesos definidos en el prototipo del usuario.") +
    metrics([
      { value: `${RESIDENTES.length}/18`, label: "Residentes activos" },
      { value: isCam || isNutri ? "16 h" : ALERTAS.length, label: isCam || isNutri ? "Edicion permitida" : "Alertas visibles" },
      { value: isNutri ? REGISTROS_NUTRI.length : isCam ? REGISTROS_CAM.length : REGISTROS_PRO.length, label: "Mis registros" },
      { value: "Activo", label: "Estado sesion" }
    ]) +
    `<div class="card">
      <h2>Accesos rapidos</h2>
      <div class="toolbar">
        ${quickActions()}
      </div>
    </div>`;
}

function quickActions() {
  if (state.role === "cam") {
    return `<button class="btn primary" onclick="go('formularioCam')">Ingresar registro CAM</button>
      <button class="btn secondary" onclick="go('misRegistrosCam')">Ver mis registros</button>`;
  }
  if (state.role === "directora") {
    return `<button class="btn primary" onclick="go('formularioDt')">Ingresar evolucion DT</button>
      <button class="btn secondary" onclick="go('dashboardResidente')">Buscar residente</button>`;
  }
  if (state.role === "enfermero") {
    return `<button class="btn primary" onclick="go('formularioEnfermero')">Ingresar evolucion Enfermero</button>
      <button class="btn secondary" onclick="go('dashboardResidente')">Buscar residente</button>`;
  }
  return `<button class="btn primary" onclick="go('formularioNutri')">Ingresar registro nutricional</button>
    <button class="btn secondary" onclick="go('residentes')">Buscar residente</button>`;
}

function renderResidentes(view) {
  view.innerHTML = page("Residentes", "Busqueda y ficha resumida del residente seleccionado.") +
    residentToolbar() +
    residentProfile(selectedResident()) +
    residentsTable(false);
  attachResidentButtons();
}

function renderBaseDatosResidentes(view) {
  view.innerHTML = page("Base datos residentes", "Vista administrativa para revisar datos maestros importados desde Excel.") +
    residentsTable(true);
  attachResidentButtons();
}

function residentToolbar() {
  return `<div class="toolbar">
    ${RESIDENTES.map((r) => `<button class="btn secondary resident-picker" data-id="${r.id}">${r.nombre}</button>`).join("")}
  </div>`;
}

function residentSearchPanel() {
  const resident = selectedResident();
  return `<div class="card">
    <h2>Buscar residente</h2>
    <div class="grid3">
      <div>
        <label>Nombre o RUT</label>
        <input id="residentSearchInput" list="residentSearchOptions" value="${resident.nombre}" placeholder="Escriba para buscar residente">
        <datalist id="residentSearchOptions">
          ${RESIDENTES.map((r) => `<option value="${r.nombre}">${r.rut}</option>`).join("")}
          ${RESIDENTES.map((r) => `<option value="${r.rut}">${r.nombre}</option>`).join("")}
        </datalist>
      </div>
      <div>
        <label>Residente activo</label>
        <input value="${resident.nombre}" readonly>
      </div>
      <div class="form-actions">
        <button class="btn primary" id="acceptResidentSearch">Aceptar</button>
      </div>
    </div>
    <div class="notice">Al aceptar se actualizan la ficha, bitacora de los ultimos 5 dias, alertas y graficas del residente seleccionado.</div>
  </div>`;
}

function selectedResident() {
  return RESIDENTES.find((r) => r.id === state.residentId) || RESIDENTES[0];
}

function residentProfile(r) {
  const sexClass = r.sexo === "Femenino" ? "femenino" : "masculino";
  return `<div class="card profile ${sexClass}">
    <h2>Ficha resumida <span class="badge">${r.estado}</span></h2>
    <div class="grid3">
      ${field("Nombre", r.nombre)}
      ${field("RUT", r.rut)}
      ${field("Edad", r.edad)}
      ${field("Sexo", r.sexo)}
      ${field("Fecha ingreso", r.ingreso)}
      ${field("Peso inicial", r.peso)}
      ${field("Patologias ingreso", r.patologias)}
      ${field("Apoderado", r.apoderado)}
      ${field("Mail apoderado", r.mail)}
      ${field("Telefono apoderado", r.telefonoApoderado)}
      ${field("Contacto SOS", r.contactoSos)}
      ${field("Servicio urgencia", r.urgencia)}
    </div>
  </div>`;
}

function field(label, value) {
  return `<div class="field"><small>${label}</small><b>${value}</b></div>`;
}

function residentsTable(admin) {
  return `<div class="card">
    <h2>${admin ? "Tabla maestra" : "Listado de residentes activos"}</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th><th>RUT</th><th>Sexo</th><th>Edad</th><th>Estado</th><th>Apoderado</th><th>Accion</th>
          </tr>
        </thead>
        <tbody>
          ${RESIDENTES.map((r) => `<tr>
            <td>${r.nombre}</td><td>${r.rut}</td><td>${r.sexo}</td><td>${r.edad}</td>
            <td><span class="badge green">${r.estado}</span></td><td>${r.apoderado}</td>
            <td><button class="btn secondary resident-picker" data-id="${r.id}">${admin ? "Editar" : "Ver ficha"}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function attachResidentButtons() {
  document.querySelectorAll(".resident-picker").forEach((button) => {
    button.addEventListener("click", () => {
      state.residentId = Number(button.dataset.id);
      renderView();
    });
  });
}

function attachResidentSearch() {
  const input = $("residentSearchInput");
  const button = $("acceptResidentSearch");
  if (!input || !button) return;
  const accept = () => {
    const query = normalizeSearch(input.value);
    const exact = RESIDENTES.find((r) => normalizeSearch(r.nombre) === query || normalizeSearch(r.rut) === query);
    const partial = RESIDENTES.find((r) => normalizeSearch(r.nombre).includes(query) || normalizeSearch(r.rut).includes(query));
    const resident = exact || partial;
    if (!resident) {
      openModal("Residente no encontrado", "Escriba parte del nombre o seleccione una opcion sugerida antes de aceptar.");
      return;
    }
    state.residentId = resident.id;
    renderView();
  };
  button.addEventListener("click", accept);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") accept();
  });
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function renderFormularioCam(view) {
  view.innerHTML = page("Registro CAM", "Formulario modular: control de ciclos, medicamentos y observaciones segun corresponda.") +
    `<div class="notice">Habilite solo las secciones que aplican. Antes de guardar se solicita confirmacion.</div>
    <div class="form-section">
      <h2>Datos base</h2>
      <div class="grid3">
        <div><label>Usuario de acceso</label><select><option>cam-dia@hogarantu.cl</option><option>cam-noche@hogarantu.cl</option></select></div>
        <div><label>Nombre y apellido cuidadora *</label><input id="camCuidadora" required placeholder="Ej: Maria Gonzalez Soto"></div>
        <div><label>Turno</label><select id="camTurno"><option>Dia</option><option>Noche</option></select></div>
        <div><label>Fecha *</label><input id="camFecha" required type="date"></div>
        <div><label>Hora *</label><input id="camHora" required type="time"></div>
        <div><label>Residente *</label>${residentSelect("camResidente")}</div>
      </div>
    </div>
    ${toggle("chkCiclos", "Registrar control de ciclos")}
    <div id="secCiclos" class="form-section hidden">
      <h2>Control de ciclos</h2>
      <div class="grid3">
        <div><label>Temperatura C</label><input id="camTemp" type="number" step="0.1" placeholder="36.8"></div>
        <div><label>Saturacion %</label><input id="camSpo2" type="number" placeholder="96"></div>
        <div><label>Presion arterial mmHg</label><input id="camPa" placeholder="125/80"></div>
        <div><label>HGT / Glucosa mg/dL</label><input id="camHgt" type="number" placeholder="Opcional"></div>
      </div>
    </div>
    ${toggle("chkMed", "Administracion de medicamentos")}
    <div id="secMed" class="form-section hidden">
      <h2>Administracion de medicamentos</h2>
      <div class="grid2">
        <div><label>Hora administracion</label><input id="camHoraMed" type="time"></div>
        <div><label>Nombre medicamento</label><input id="camMed" placeholder="Ej: Losartan 50 mg"></div>
      </div>
    </div>
    ${toggle("chkObs", "Agregar observaciones")}
    <div id="secObs" class="form-section hidden">
      <h2>Observaciones</h2>
      <label>Detalle</label>
      <textarea id="camObs" placeholder="Cambios conductuales, orina de mal olor, salidas, accidentes o urgencias medicas"></textarea>
    </div>
    <button class="btn primary" onclick="confirmCam()">Guardar registro</button>`;
  bindToggles();
}

function toggle(id, label) {
  return `<label class="toggle-row"><input type="checkbox" id="${id}"> ${label}</label>`;
}

function bindToggles() {
  [["chkCiclos", "secCiclos"], ["chkMed", "secMed"], ["chkObs", "secObs"]].forEach(([chk, sec]) => {
    const checkbox = $(chk);
    const section = $(sec);
    if (checkbox && section) {
      checkbox.addEventListener("change", () => section.classList.toggle("hidden", !checkbox.checked));
    }
  });
}

function residentSelect(id) {
  return `<select id="${id}">${RESIDENTES.map((r) => `<option value="${r.id}">${r.nombre}</option>`).join("")}</select>`;
}

function confirmCam() {
  const faltantes = [];
  if (!$("camCuidadora").value.trim()) faltantes.push("nombre de la cuidadora");
  if (!$("camFecha").value) faltantes.push("fecha");
  if (!$("camHora").value) faltantes.push("hora");
  if (!$("camResidente").value) faltantes.push("residente");
  if (faltantes.length) {
    openModal("Campos obligatorios", `Debe completar: ${faltantes.join(", ")}.`);
    return;
  }
  const resident = RESIDENTES.find((r) => r.id === Number($("camResidente").value));
  openModal("Confirmar registro CAM", `Esta seguro que desea agregar este registro al residente ${resident.nombre}?`, () => {
    REGISTROS_CAM.unshift({
      fecha: `${$("camFecha").value} ${$("camHora").value}`,
      residente: resident.nombre,
      usuario: $("camTurno").value === "Noche" ? "cam-noche@hogarantu.cl" : "cam-dia@hogarantu.cl",
      turno: $("camTurno").value,
      cuidadora: $("camCuidadora").value.trim(),
      tipo: camTipo(),
      medicamento: $("chkMed").checked ? ($("camMed").value || "Medicamento sin nombre") : "",
      horaMedicamento: $("chkMed").checked ? ($("camHoraMed").value || "") : "",
      detalle: camDetalle(),
      editable: true
    });
    state.view = "misRegistrosCam";
    renderShell();
  });
}

function camTipo() {
  const parts = [];
  if ($("chkCiclos").checked) parts.push("Control de ciclos");
  if ($("chkMed").checked) parts.push("Medicamento");
  if ($("chkObs").checked) parts.push("Observacion");
  return parts.length ? parts.join(" + ") : "Registro CAM";
}

function camDetalle() {
  const parts = [];
  if ($("chkCiclos").checked) parts.push(`Temp ${$("camTemp").value || "-"} C, Sat ${$("camSpo2").value || "-"}%, PA ${$("camPa").value || "-"}, HGT ${$("camHgt").value || "-"}.`);
  if ($("chkMed").checked) parts.push(`Medicamento ${$("camMed").value || "sin nombre"} a las ${$("camHoraMed").value || "--:--"}.`);
  if ($("chkObs").checked) parts.push($("camObs").value || "Sin detalle de observacion.");
  return parts.join(" ");
}

function renderMisRegistrosCam(view) {
  view.innerHTML = page("Mis registros CAM", "Los registros pueden editarse solo hasta 16 horas despues de su ingreso.") +
    registrosTable(REGISTROS_CAM, ["Fecha", "Residente", "Usuario", "Turno", "Cuidadora", "Tipo", "Detalle"]);
}

function registrosTable(rows, headers) {
  const sortedRows = [...rows].sort((a, b) => {
    if (!a.fecha || !b.fecha) return 0;
    return parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha);
  });
  return `<div class="card table-wrap"><table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}<th>Estado edicion</th><th>Accion</th></tr></thead>
    <tbody>${sortedRows.map((r) => `<tr>
      ${headers.map((h) => `<td>${valueForHeader(r, h)}</td>`).join("")}
      <td>${r.editable ? '<span class="badge green">Editable</span>' : '<span class="badge red">Bloqueado</span>'}</td>
      <td><button class="btn ${r.editable ? "secondary" : "ghost"}">${r.editable ? "Editar" : "No editable"}</button></td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function valueForHeader(row, header) {
  const key = {
    Fecha: "fecha",
    Residente: "residente",
    Usuario: "usuario",
    Turno: "turno",
    Cuidadora: "cuidadora",
    Tipo: "tipo",
    Detalle: "detalle",
    Registro: "registro",
    Rol: "rol",
    IMC: "imc",
    Observacion: "observacion"
  }[header];
  return row[key] || "";
}

function renderFormularioProfesional(rol) {
  $("view").innerHTML = page(`Formulario ${rol}`, "Seleccione un residente activo. Al aceptar, se muestra su ficha resumida antes de guardar.") +
    `<div class="form-section">
      <div class="grid3">
        <div><label>Residente</label>${residentSelect("proResidente")}</div>
        <div><label>Fecha</label><input id="proFecha" type="date"></div>
        <div><label>Hora</label><input id="proHora" type="time"></div>
      </div>
    </div>
    <div id="proFicha">${residentProfile(RESIDENTES[0])}</div>
    <div class="form-section">
      <label>Evolucion / registro ${rol}</label>
      <textarea id="proTexto"></textarea>
    </div>
    <button class="btn primary" onclick="confirmProfesional('${rol}')">Guardar registro</button>`;
  $("proResidente").addEventListener("change", () => {
    const resident = RESIDENTES.find((r) => r.id === Number($("proResidente").value));
    $("proFicha").innerHTML = residentProfile(resident);
  });
}

function confirmProfesional(rol) {
  const resident = RESIDENTES.find((r) => r.id === Number($("proResidente").value));
  openModal(`Confirmar registro ${rol}`, `Esta seguro que desea agregar este registro al residente ${resident.nombre}?`, () => {
    REGISTROS_PRO.unshift({
      fecha: `${$("proFecha").value || "2026-06-14"} ${$("proHora").value || "10:00"}`,
      residente: resident.nombre,
      rol,
      registro: $("proTexto").value || "Registro sin detalle.",
      editable: true
    });
    state.view = "misRegistrosProfesional";
    renderShell();
  });
}

function renderDashboardResidente(view) {
  const r = selectedResident();
  view.innerHTML = page("Dashboard residentes", "Consulta de ficha, evolucion, controles CAM, nutricion y alertas.") +
    residentSearchPanel() +
    residentProfile(r) +
    `<div class="tabs">
      ${["evolucion", "cam", "nutricion", "alertas"].map((tab) => `<button class="${state.dashboardTab === tab ? "active" : ""}" data-tab="${tab}">${tabLabel(tab)}</button>`).join("")}
    </div>
    <div id="dashTabContent">${dashboardTabContent(r)}</div>`;
  attachResidentSearch();
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dashboardTab = button.dataset.tab;
      renderView();
    });
  });
}

function tabLabel(tab) {
  return { evolucion: "Evolucion", cam: "Controles CAM", nutricion: "Nutricion", alertas: "Alertas" }[tab];
}

function dashboardTabContent(r) {
  if (state.dashboardTab === "cam") {
    return renderGraficasCam(r) + controlesTable(r);
  }
  if (state.dashboardTab === "nutricion") {
    return pesoMensualCard(r) + `<div class="timeline"><b>Nutricion</b><p>Ultimo IMC registrado: 22.4. Mantener indicaciones.</p></div>`;
  }
  if (state.dashboardTab === "alertas") {
    return residentAlerts(r);
  }
  return bitacoraResidente(r);
}

function renderGraficasCam(resident) {
  const data = ultimosControlesSemana(resident);
  return `<div class="notice">Graficas de controles CAM: ultimos 5 dias, con 3 lecturas por dia. Eje X: fecha de cada lectura. Eje Y: valor registrado.</div>
    <div class="chart-grid">
      ${chartCard(UMBRALES_CICLOS.temp, data, "temp")}
      ${chartCard(UMBRALES_CICLOS.spo2, data, "spo2")}
      ${chartCard(UMBRALES_CICLOS.pad, data, "pad")}
      ${chartCard(UMBRALES_CICLOS.hgt, data, "hgt")}
    </div>
    ${medicamentosTable(resident)}
    ${pesoMensualCard(resident)}`;
}

function ultimosControlesSemana(resident) {
  return CONTROLES_CICLOS
    .filter((row) => row.residente === resident.nombre)
    .slice(-CONTROL_PUNTOS_GRAFICA);
}

function chartCard(config, data, key) {
  const { label, unit, normalLow, normalHigh } = config;
  if (!data.length) {
    return `<div class="card"><h2>${label}</h2><div class="notice">Sin datos para graficar.</div></div>`;
  }
  const values = data.map((row) => Number(row[key]));
  const hasLimits = normalLow !== null && normalHigh !== null;
  const minValue = hasLimits ? Math.min(...values, normalLow) : Math.min(...values) - 0.5;
  const maxValue = hasLimits ? Math.max(...values, normalHigh) : Math.max(...values) + 0.5;
  const padding = 38;
  const width = 420;
  const height = 220;
  const span = Math.max(1, maxValue - minValue);
  const xStep = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const yFor = (value) => height - padding - ((value - minValue) / span) * (height - padding * 2);
  const yTicks = hasLimits ? chartTicks(normalLow, normalHigh, 5) : chartTicks(minValue, maxValue, 5);
  const points = data.map((row, index) => ({
    x: padding + index * xStep,
    y: yFor(Number(row[key])),
    value: Number(row[key]),
    fecha: row.fecha
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const yLow = hasLimits ? yFor(normalLow) : null;
  const yHigh = hasLimits ? yFor(normalHigh) : null;
  return `<div class="card">
    <h2>${label}</h2>
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#d4dddf" stroke-width="1.5" />
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#d4dddf" stroke-width="1.5" />
      ${yTicks.map((tick) => `<line x1="${padding}" y1="${yFor(tick)}" x2="${width - padding}" y2="${yFor(tick)}" stroke="#edf2f2" stroke-width="1" />`).join("")}
      ${yTicks.map((tick) => `<text x="7" y="${yFor(tick) + 4}" font-size="9.5" font-weight="700" fill="#465154">${formatChartNumber(tick)}</text>`).join("")}
      ${hasLimits ? `<line x1="${padding}" y1="${yHigh}" x2="${width - padding}" y2="${yHigh}" stroke="#475569" stroke-dasharray="5 4" />` : ""}
      ${hasLimits ? `<line x1="${padding}" y1="${yLow}" x2="${width - padding}" y2="${yLow}" stroke="#475569" stroke-dasharray="5 4" />` : ""}
      <polyline points="${line}" fill="none" stroke="#188f8f" stroke-width="3" />
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="${hasLimits ? statusColor(point.value, normalLow, normalHigh) : "#188f8f"}"><title>${point.fecha}: ${point.value} ${unit}</title></circle>`).join("")}
      ${points.map((point) => `<text x="${point.x - 8}" y="${Math.max(12, point.y - 8)}" font-size="7.5" font-weight="700" fill="#263238">${point.value}</text>`).join("")}
      ${points.map((point) => `<text x="${point.x - 9}" y="${height - 10}" font-size="7.5" font-weight="700" fill="#465154">${point.fecha.slice(0, 5)}</text>`).join("")}
    </svg>
    <div class="legend">
      ${hasLimits ? '<span><i class="dot green"></i>Normal</span><span><i class="dot yellow"></i>Alerta</span><span><i class="dot red"></i>Critico</span>' : '<span><i class="dot green"></i>Seguimiento</span>'}
      <span>Ultimo: ${values[values.length - 1]} ${unit}</span>
    </div>
  </div>`;
}

function reportCharts(controles, days) {
  return `<h3>Graficas control de ciclos - ultimos ${days} dias</h3>
    <div class="chart-grid">
      ${chartCardReport(UMBRALES_CICLOS.temp, controles, "temp")}
      ${chartCardReport(UMBRALES_CICLOS.spo2, controles, "spo2")}
      ${chartCardReport(UMBRALES_CICLOS.pad, controles, "pad")}
      ${chartCardReport(UMBRALES_CICLOS.hgt, controles, "hgt")}
    </div>`;
}

function chartCardReport(config, data, key) {
  const { label, unit, normalLow, normalHigh } = config;
  if (!data.length) {
    return `<div class="card"><h2>${label}</h2><div class="notice">Sin datos para graficar.</div></div>`;
  }
  const values = data.map((row) => Number(row[key]));
  const minValue = Math.min(...values, normalLow);
  const maxValue = Math.max(...values, normalHigh);
  const padding = 42;
  const width = 620;
  const height = 230;
  const span = Math.max(1, maxValue - minValue);
  const xStep = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const yFor = (value) => height - padding - ((value - minValue) / span) * (height - padding * 2);
  const yTicks = chartTicks(normalLow, normalHigh, 5);
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));
  const points = data.map((row, index) => ({
    x: padding + index * xStep,
    y: yFor(Number(row[key])),
    value: Number(row[key]),
    fecha: row.fecha,
    showLabel: index % labelEvery === 0 || index === data.length - 1
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const yLow = yFor(normalLow);
  const yHigh = yFor(normalHigh);
  return `<div class="card">
    <h2>${label}</h2>
    <svg class="chart-svg report-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label} reporte">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#d4dddf" stroke-width="1.5" />
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#d4dddf" stroke-width="1.5" />
      ${yTicks.map((tick) => `<line x1="${padding}" y1="${yFor(tick)}" x2="${width - padding}" y2="${yFor(tick)}" stroke="#edf2f2" stroke-width="1" />`).join("")}
      ${yTicks.map((tick) => `<text x="7" y="${yFor(tick) + 4}" font-size="9.5" font-weight="700" fill="#465154">${formatChartNumber(tick)}</text>`).join("")}
      <line x1="${padding}" y1="${yHigh}" x2="${width - padding}" y2="${yHigh}" stroke="#475569" stroke-dasharray="5 4" />
      <line x1="${padding}" y1="${yLow}" x2="${width - padding}" y2="${yLow}" stroke="#475569" stroke-dasharray="5 4" />
      <polyline points="${line}" fill="none" stroke="#188f8f" stroke-width="2.4" />
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.2" fill="${statusColor(point.value, normalLow, normalHigh)}"><title>${point.fecha}: ${point.value} ${unit}</title></circle>`).join("")}
      ${points.map((point) => `<text x="${point.x - 8}" y="${Math.max(12, point.y - 7)}" font-size="6.8" font-weight="700" fill="#263238">${point.value}</text>`).join("")}
      ${points.filter((point) => point.showLabel).map((point) => `<text x="${point.x - 13}" y="${height - 10}" font-size="7" font-weight="700" fill="#465154">${point.fecha.slice(0, 5)}</text>`).join("")}
    </svg>
    <div class="legend">
      <span><i class="dot green"></i>Normal</span><span><i class="dot yellow"></i>Alerta</span><span><i class="dot red"></i>Critico</span>
      <span>${data.length} lecturas</span>
    </div>
  </div>`;
}

function chartTicks(min, max, count) {
  const step = (max - min) / Math.max(1, count - 1);
  return Array.from({ length: count }, (_, index) => Number((min + step * index).toFixed(1)));
}

function pesoMensualCard(resident) {
  const pesos = CONTROLES_PESO.filter((row) => row.residente === resident.nombre);
  const ultimo = pesos[pesos.length - 1];
  return `<div class="card table-wrap">
    <h2>Peso mensual y regimen</h2>
    <div class="notice">El peso no forma parte de los 3 ciclos diarios. Se registra al ingreso y luego como control mensual junto a indicaciones de minuta o regimen.</div>
    ${pesoChart(pesos)}
    <table>
      <thead><tr><th>Fecha control</th><th>Peso</th><th>Minuta / regimen indicado</th></tr></thead>
      <tbody>${pesos.map((row) => `<tr><td>${row.fecha}</td><td>${row.peso} kg</td><td>${row.regimen}</td></tr>`).join("")}</tbody>
    </table>
    ${ultimo ? `<p><b>Ultima indicacion:</b> ${ultimo.regimen}</p>` : ""}
  </div>`;
}

function pesoChart(pesos) {
  if (!pesos.length) return `<div class="notice">Sin controles mensuales de peso.</div>`;
  const values = pesos.map((row) => Number(row.peso));
  const minValue = Math.floor(Math.min(...values) - 1);
  const maxValue = Math.ceil(Math.max(...values) + 1);
  const padding = 42;
  const width = 760;
  const height = 230;
  const span = Math.max(1, maxValue - minValue);
  const xStep = pesos.length > 1 ? (width - padding * 2) / (pesos.length - 1) : 0;
  const yFor = (value) => height - padding - ((value - minValue) / span) * (height - padding * 2);
  const points = pesos.map((row, index) => ({
    x: padding + index * xStep,
    y: yFor(Number(row.peso)),
    value: Number(row.peso),
    fecha: row.fecha
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  return `<svg class="chart-svg wide-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafica mensual de peso">
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#d4dddf" stroke-width="1.5" />
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#d4dddf" stroke-width="1.5" />
    <text x="8" y="${padding + 4}" font-size="11" font-weight="700" fill="#465154">${formatChartNumber(maxValue)} kg</text>
    <text x="8" y="${height - padding}" font-size="11" font-weight="700" fill="#465154">${formatChartNumber(minValue)} kg</text>
    <polyline points="${line}" fill="none" stroke="#4f46e5" stroke-width="3" />
    ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#4f46e5"><title>${point.fecha}: ${point.value} kg</title></circle>`).join("")}
    ${points.map((point) => `<text x="${point.x - 24}" y="${height - 12}" font-size="10" font-weight="700" fill="#465154">${point.fecha.slice(5)}</text>`).join("")}
    ${points.map((point) => `<text x="${point.x - 14}" y="${point.y - 10}" font-size="10" font-weight="700" fill="#263238">${point.value} kg</text>`).join("")}
  </svg>`;
}

function formatChartNumber(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function statusColor(value, normalLow, normalHigh) {
  if (value >= normalLow && value <= normalHigh) return "#1f8f4d";
  const distance = Math.min(Math.abs(value - normalLow), Math.abs(value - normalHigh));
  return distance <= Math.max(1, (normalHigh - normalLow) * 0.2) ? "#d79a00" : "#b4232b";
}

function controlesTable(resident) {
  const data = ultimosControlesSemana(resident);
  return `<div class="card table-wrap">
    <h2>Bitacora CAM ultimos 5 dias</h2>
    <table>
      <thead><tr><th>Fecha</th><th>Temperatura</th><th>Saturacion</th><th>Presion diastolica</th><th>HGT</th></tr></thead>
      <tbody>${data.map((row) => `<tr><td>${row.fecha}</td><td>${row.temp} C</td><td>${row.spo2} %</td><td>${row.pad} mmHg</td><td>${row.hgt} mg/dL</td></tr>`).join("")}</tbody>
    </table>
  </div>`;
}

function medicamentosTable(resident) {
  const today = new Date(2026, 5, 14, 23, 59);
  const camLimit = daysBefore(today, 5);
  const rows = REGISTROS_CAM
    .filter((registro) => registro.residente === resident.nombre)
    .filter((registro) => registro.tipo.toLowerCase().includes("medicamento"))
    .filter((registro) => parseRegistroDate(registro.fecha) >= camLimit)
    .sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  return `<div class="card table-wrap">
    <h2>Control de medicamentos ultimos 5 dias</h2>
    <table>
      <thead><tr><th>Fecha</th><th>Remedio</th><th>Usuario</th><th>Cuidadora</th><th>Detalle</th></tr></thead>
      <tbody>
        ${rows.length ? rows.map((row) => `<tr>
          <td>${medicamentoFecha(row)}</td>
          <td>${row.medicamento || inferMedicamento(row.detalle)}</td>
          <td>${row.usuario || usuarioCamPorTurno(row.turno)}</td>
          <td>${row.cuidadora}</td>
          <td>${row.detalle}</td>
        </tr>`).join("") : `<tr><td colspan="5">Sin administracion de medicamentos registrada para este residente en los ultimos 5 dias.</td></tr>`}
      </tbody>
    </table>
  </div>`;
}

function usuarioCamPorTurno(turno) {
  return turno === "Noche" ? "cam-noche@hogarantu.cl" : "cam-dia@hogarantu.cl";
}

function medicamentoFecha(row) {
  if (!row.horaMedicamento) return row.fecha;
  return `${row.fecha.split(" ")[0]} ${row.horaMedicamento}`;
}

function inferMedicamento(detalle) {
  const match = String(detalle || "").match(/(?:Medicamento\s+)?([^\\.]+(?:mg|mcg|ml|UI))/i);
  return match ? match[1].trim() : "Medicamento registrado";
}

function bitacoraResidente(resident) {
  const entries = bitacoraResumenEntries(resident);
  const content = entries.length
    ? entries.map((entry) => `<div class="timeline ${entry.clase}">
        <b>${entry.fecha} | ${entry.tipo}</b>
        <p>${entry.detalle}</p>
      </div>`).join("")
    : `<div class="notice">Sin registros para el periodo seleccionado en esta maqueta.</div>`;
  return `<div class="card">
    <h2>Bitacora resumen de registros</h2>
    <div class="notice">Incluye registros CAM de los ultimos 5 dias, Directora Tecnica y Enfermero del ultimo mes, y registros de Nutricionista. Orden: fecha decreciente.</div>
    ${content}
  </div>`;
}

function bitacoraResumenEntries(resident) {
  const today = new Date(2026, 5, 14, 23, 59);
  const camLimit = daysBefore(today, 5);
  const monthLimit = daysBefore(today, 30);
  const camEntries = REGISTROS_CAM
    .filter((registro) => registro.residente === resident.nombre && parseRegistroDate(registro.fecha) >= camLimit)
    .map((registro) => ({
      fecha: registro.fecha,
      date: parseRegistroDate(registro.fecha),
      tipo: `CAM / ${registro.tipo}`,
      detalle: `<b>Usuario:</b> ${registro.usuario || usuarioCamPorTurno(registro.turno)}. <b>Cuidadora:</b> ${registro.cuidadora}. <b>Turno:</b> ${registro.turno}. ${registro.detalle}`,
      clase: "timeline-cam"
    }));
  const profesionalEntries = REGISTROS_PRO
    .filter((registro) => registro.residente === resident.nombre && parseRegistroDate(registro.fecha) >= monthLimit)
    .map((registro) => ({
      fecha: registro.fecha,
      date: parseRegistroDate(registro.fecha),
      tipo: registro.rol,
      detalle: registro.registro,
      clase: registro.rol === "Enfermero" ? "timeline-enfermero" : "timeline-dt"
    }));
  const nutriEntries = REGISTROS_NUTRI
    .filter((registro) => registro.residente === resident.nombre)
    .map((registro) => ({
      fecha: registro.fecha,
      date: parseRegistroDate(registro.fecha),
      tipo: "Nutricionista",
      detalle: `<b>IMC:</b> ${registro.imc}. ${registro.observacion}`,
      clase: "timeline-nutri"
    }));
  return [...camEntries, ...profesionalEntries, ...nutriEntries]
    .sort((a, b) => b.date - a.date);
}

function daysBefore(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - days);
  return copy;
}

function parseRegistroDate(value) {
  const [datePart, timePart = "00:00"] = value.split(" ");
  const [hour, minute] = timePart.split(":").map(Number);
  const parts = datePart.split("-").map(Number);
  if (parts.length === 2) {
    const [day, month] = parts;
    return new Date(2026, month - 1, day, hour || 0, minute || 0);
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, hour || 0, minute || 0);
}

function residentAlerts(resident) {
  const items = ALERTAS.filter((a) => a.residente === resident.nombre);
  return items.length ? items.map(alertaItem).join("") : `<div class="notice">Sin alertas abiertas para este residente.</div>`;
}

function renderMisRegistrosProfesional(view) {
  const roleLabel = ROLES[state.role].label;
  const rows = REGISTROS_PRO.filter((r) => r.rol === roleLabel || roleLabel === "Directora Tecnica" || roleLabel === "Enfermero");
  view.innerHTML = page(`Mis registros ${roleLabel}`, "Los registros propios pueden editarse solo durante 16 horas.") +
    registrosTable(rows, ["Fecha", "Residente", "Rol", "Registro"]);
}

function renderFormularioNutri(view) {
  view.innerHTML = page("Registro nutricional", "Seleccione un residente activo. Edad, peso y sexo se autocompletan desde la ficha.") +
    `<div class="form-section">
      <div class="grid3">
        <div><label>Residente</label>${residentSelect("nutriResidente")}</div>
        <div><label>Fecha</label><input id="nutriFecha" type="date"></div>
        <div><label>Hora</label><input id="nutriHora" type="time"></div>
        <div><label>Edad</label><input id="nutriEdad" readonly></div>
        <div><label>Peso inicial</label><input id="nutriPeso" readonly></div>
        <div><label>Sexo</label><input id="nutriSexo" readonly></div>
        <div><label>Estatura</label><input id="nutriTalla" placeholder="Ej: 1.62"></div>
        <div><label>IMC</label><input id="nutriImc" type="number" step="0.1"></div>
        <div><label>Clasificacion CC</label><input id="nutriCc"></div>
        <div><label>Clasificacion CB</label><input id="nutriCb"></div>
        <div><label>Clasificacion PT</label><input id="nutriPt"></div>
        <div><label>Clasificacion CP</label><input id="nutriCp"></div>
      </div>
      <label>Observaciones o indicaciones nutricionales</label>
      <textarea id="nutriObs"></textarea>
    </div>
    <button class="btn primary" onclick="confirmNutri()">Guardar registro</button>`;
  bindNutriResident();
}

function bindNutriResident() {
  const update = () => {
    const r = RESIDENTES.find((resident) => resident.id === Number($("nutriResidente").value));
    $("nutriEdad").value = r.edad;
    $("nutriPeso").value = r.peso;
    $("nutriSexo").value = r.sexo;
  };
  $("nutriResidente").addEventListener("change", update);
  update();
}

function confirmNutri() {
  const resident = RESIDENTES.find((r) => r.id === Number($("nutriResidente").value));
  openModal("Confirmar registro nutricional", `Esta seguro que desea agregar este registro nutricional al residente ${resident.nombre}?`, () => {
    REGISTROS_NUTRI.unshift({
      fecha: `${$("nutriFecha").value || "2026-06-14"} ${$("nutriHora").value || "12:00"}`,
      residente: resident.nombre,
      imc: $("nutriImc").value || "-",
      observacion: $("nutriObs").value || "Sin observaciones.",
      editable: true
    });
    state.view = "misRegistrosNutri";
    renderShell();
  });
}

function renderMisRegistrosNutri(view) {
  view.innerHTML = page("Mis registros nutricionales", "Los registros pueden editarse solo hasta 16 horas despues de su ingreso.") +
    registrosTable(REGISTROS_NUTRI, ["Fecha", "Residente", "IMC", "Observacion"]);
}

function renderFormulariosAdmin(view) {
  view.innerHTML = page("Formularios", "Acceso administrativo a formularios por rol.") +
    `<div class="tabs">
      <button class="active">CAM / Cuidadoras</button>
      <button>Directora Tecnica</button>
      <button>Enfermero</button>
      <button>Nutricionista</button>
    </div>
    <div class="card"><h2>Vista previa</h2><p>Desde aqui el administrador podra revisar estructura, registros y permisos por formulario.</p></div>`;
}

function renderRegistrosUsuarios(view) {
  view.innerHTML = page("Registros usuarios", "Revision administrativa de registros ingresados por perfiles.") +
    registrosTable([...REGISTROS_CAM, ...REGISTROS_PRO, ...REGISTROS_NUTRI], ["Fecha", "Residente", "Tipo", "Detalle"]);
}

function renderAlertas(view) {
  view.innerHTML = page("Alertas / Alarmas", "Panel de alertas abiertas y cierre con comentario.") +
    `<div class="card">${alertasList(true)}</div>`;
}

function alertasList(withActions = false) {
  return ALERTAS.map((a) => alertaItem(a, withActions)).join("");
}

function alertaItem(a, withActions = false) {
  return `<div class="timeline">
    <b>${a.fecha} | ${a.variable} <span class="badge ${a.color}">${a.nivel}</span></b>
    <p><b>Residente:</b> ${a.residente}<br><b>Valor:</b> ${a.valor}<br><b>Accion sugerida:</b> ${a.accion}</p>
    ${withActions ? '<button class="btn danger" onclick="openModal(\'Cerrar alerta\', \'Registrar comentario de cierre de alerta?\')">Cerrar alerta</button>' : ""}
  </div>`;
}

function renderRangos(view) {
  view.innerHTML = page("Rangos de alerta", "Configuracion de valores normales, alerta y criticos.") +
    `<div class="grid2">
      ${rangoCard("Temperatura", "36.0", "37.5", "C")}
      ${rangoCard("Saturacion", "95", "100", "%")}
      ${rangoCard("Presion diastolica", "60", "89", "mmHg")}
      ${rangoCard("HGT / Glucosa", "70", "180", "mg/dL")}
    </div>
    <button class="btn primary" onclick="openModal('Rangos', 'Rangos actualizados en la maqueta.')">Guardar nuevos rangos</button>`;
}

function rangoCard(nombre, min, max, unidad) {
  return `<div class="form-section">
    <h2>${nombre}</h2>
    <div class="grid3">
      <div><label>Normal inferior</label><input value="${min}"></div>
      <div><label>Normal superior</label><input value="${max}"></div>
      <div><label>Unidad</label><input value="${unidad}" readonly></div>
    </div>
    <label>Accion recomendada</label>
    <textarea>Informar a Enfermero y repetir medicion si corresponde.</textarea>
  </div>`;
}

function renderUsuarios(view) {
  view.innerHTML = page("Usuarios y roles", "Usuarios iniciales detectados desde Excel y permisos propuestos.") +
    `<div class="card table-wrap"><table>
      <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Accion</th></tr></thead>
      <tbody>
        ${Object.values(ROLES).map((r) => `<tr><td>${r.label}</td><td>${r.user}</td><td>${r.label}</td><td><button class="btn secondary">Editar</button></td></tr>`).join("")}
      </tbody>
    </table></div>`;
}

function renderPdf(view) {
  const resident = RESIDENTES.find((r) => r.id === Number(state.pdfResidentId)) || RESIDENTES[0];
  const period = Number(state.pdfPeriodDays);
  if (!state.pdfEmail) state.pdfEmail = resident.mail || "";
  const emailValid = isValidEmail(state.pdfEmail);
  const ready = Boolean(resident && period);
  view.innerHTML = page("Reportes PDF", "Seleccione residente y periodo para habilitar la creacion del reporte.") +
    `<div class="card">
      <h2>Parametros del reporte</h2>
      <div class="grid3">
        <div>
          <label>Residente</label>
          ${residentSelect("pdfResidente")}
        </div>
        <div>
          <label>Periodo a reportar</label>
          <div class="period-selector">
            ${[7, 15, 21, 28].map((days) => `<button class="btn ${period === days ? "primary" : "secondary"} pdf-period" data-days="${days}">${days} dias</button>`).join("")}
          </div>
        </div>
        <div>
          <label>Enviar a email</label>
          <input id="pdfEmail" type="email" value="${state.pdfEmail}" placeholder="correo@dominio.cl">
        </div>
        <div class="form-actions">
          <button class="btn primary" id="pdfGenerate" ${ready ? "" : "disabled"}>Crear reporte PDF</button>
          <button class="btn secondary" id="pdfSendMail" ${ready && emailValid ? "" : "disabled"}>Enviar por mail</button>
        </div>
      </div>
      <div class="${ready ? "success" : "notice"}">
        ${ready ? `Reporte listo para generar: ${resident.nombre}, ultimos ${period} dias. Email destino: ${state.pdfEmail || "sin correo"}.` : "Seleccione un periodo de 7, 15, 21 o 28 dias para habilitar la creacion del PDF."}
      </div>
    </div>
    ${ready ? pdfPreview(resident, period) : `<div class="card"><h2>Vista previa</h2><p>La vista previa aparecera cuando seleccione residente y periodo.</p></div>`}
    ${state.pdfGenerated ? generatedPdfSection() : ""}`;
  $("pdfResidente").value = String(resident.id);
  attachPdfControls();
}

function attachPdfControls() {
  const select = $("pdfResidente");
  const generate = $("pdfGenerate");
  const email = $("pdfEmail");
  const sendMail = $("pdfSendMail");
  if (select) {
    select.addEventListener("change", () => {
      state.pdfResidentId = Number(select.value);
      const resident = RESIDENTES.find((r) => r.id === Number(state.pdfResidentId)) || RESIDENTES[0];
      state.pdfEmail = resident.mail || "";
      state.pdfGenerated = false;
      renderView();
    });
  }
  if (email) {
    email.addEventListener("input", () => {
      state.pdfEmail = email.value.trim();
      if (sendMail) sendMail.disabled = !(Number(state.pdfPeriodDays) && isValidEmail(state.pdfEmail));
    });
  }
  document.querySelectorAll(".pdf-period").forEach((button) => {
    button.addEventListener("click", () => {
      state.pdfPeriodDays = Number(button.dataset.days);
      state.pdfGenerated = false;
      renderView();
    });
  });
  if (generate) {
    generate.addEventListener("click", () => {
      const resident = RESIDENTES.find((r) => r.id === Number(state.pdfResidentId)) || RESIDENTES[0];
      generatePdfReport(resident, Number(state.pdfPeriodDays));
    });
  }
  if (sendMail) {
    sendMail.addEventListener("click", () => {
      const resident = RESIDENTES.find((r) => r.id === Number(state.pdfResidentId)) || RESIDENTES[0];
      sendPdfByEmail(resident, Number(state.pdfPeriodDays), state.pdfEmail);
    });
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function pdfPreview(resident, days) {
  const data = reportData(resident, days);
  return `<div class="card report-preview">
    <h2>Vista previa reporte</h2>
    <div class="grid3">
      ${field("Residente", resident.nombre)}
      ${field("Periodo", `Ultimos ${days} dias`)}
      ${field("Fecha emision", "2026-06-15")}
    </div>
    ${metrics([
      { value: data.cam.length, label: "Registros CAM" },
      { value: data.pro.length, label: "Registros DT/Enfermero" },
      { value: data.nutri.length, label: "Registros Nutricion" },
      { value: data.medicamentos.length, label: "Medicamentos" }
    ])}
    ${reportCharts(data.controles, days)}
    <h3>Peso mensual</h3>
    ${pesoMensualCard(resident)}
    <h3>Bitacora resumida</h3>
    ${data.entries.slice(0, 10).map((entry) => `<div class="timeline ${entry.clase}">
      <b>${entry.fecha} | ${entry.tipo}</b>
      <p>${entry.detalle}</p>
    </div>`).join("") || `<div class="notice">Sin registros para el periodo seleccionado.</div>`}
    <h3>Medicamentos</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Fecha</th><th>Remedio</th><th>Usuario</th><th>Cuidadora</th></tr></thead>
        <tbody>${data.medicamentos.slice(0, 8).map((row) => `<tr>
          <td>${medicamentoFecha(row)}</td>
          <td>${row.medicamento || inferMedicamento(row.detalle)}</td>
          <td>${row.usuario || usuarioCamPorTurno(row.turno)}</td>
          <td>${row.cuidadora}</td>
        </tr>`).join("") || `<tr><td colspan="4">Sin medicamentos registrados en el periodo.</td></tr>`}</tbody>
      </table>
    </div>
  </div>`;
}

function reportData(resident, days) {
  const today = new Date(2026, 5, 14, 23, 59);
  const start = daysBefore(today, days);
  const inPeriod = (row) => parseRegistroDate(row.fecha) >= start && parseRegistroDate(row.fecha) <= today;
  const cam = REGISTROS_CAM.filter((row) => row.residente === resident.nombre && inPeriod(row));
  const pro = REGISTROS_PRO.filter((row) => row.residente === resident.nombre && inPeriod(row));
  const nutri = REGISTROS_NUTRI.filter((row) => row.residente === resident.nombre && inPeriod(row));
  const controles = CONTROLES_CICLOS
    .filter((row) => row.residente === resident.nombre && inPeriod(row))
    .sort((a, b) => parseRegistroDate(a.fecha) - parseRegistroDate(b.fecha));
  const medicamentos = cam
    .filter((row) => row.tipo.toLowerCase().includes("medicamento"))
    .sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  const entries = [
    ...cam.map((registro) => ({
      fecha: registro.fecha,
      date: parseRegistroDate(registro.fecha),
      tipo: `CAM / ${registro.tipo}`,
      detalle: `<b>Usuario:</b> ${registro.usuario || usuarioCamPorTurno(registro.turno)}. <b>Cuidadora:</b> ${registro.cuidadora}. ${registro.detalle}`,
      clase: "timeline-cam"
    })),
    ...pro.map((registro) => ({
      fecha: registro.fecha,
      date: parseRegistroDate(registro.fecha),
      tipo: registro.rol,
      detalle: registro.registro,
      clase: registro.rol === "Enfermero" ? "timeline-enfermero" : "timeline-dt"
    })),
    ...nutri.map((registro) => ({
      fecha: registro.fecha,
      date: parseRegistroDate(registro.fecha),
      tipo: "Nutricionista",
      detalle: `<b>IMC:</b> ${registro.imc}. ${registro.observacion}`,
      clase: "timeline-nutri"
    }))
  ].sort((a, b) => b.date - a.date);
  return { cam, pro, nutri, controles, medicamentos, entries };
}

function generatePdfReport(resident, days) {
  state.pdfGenerated = true;
  state.pdfGeneratedResidentId = resident.id;
  state.pdfGeneratedDays = days;
  renderView();
  setTimeout(() => {
    const report = $("generatedPdfReport");
    if (report) report.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
}

function generatedPdfSection() {
  const resident = RESIDENTES.find((r) => r.id === Number(state.pdfGeneratedResidentId)) || RESIDENTES[0];
  const days = Number(state.pdfGeneratedDays || state.pdfPeriodDays);
  const data = reportData(resident, days);
  return `<div class="card generated-report" id="generatedPdfReport">
    <div class="report-actions no-print">
      <h2>Reporte PDF creado</h2>
      <button class="btn primary" onclick="printGeneratedPdf()">Guardar / imprimir PDF</button>
    </div>
    <div class="print-report">
      <h1>Reporte residente</h1>
      <p class="report-meta">${resident.nombre} | Ultimos ${days} dias | Emision 2026-06-17</p>
      <h2>Resumen</h2>
      <p>Registros CAM: ${data.cam.length}. Registros profesionales: ${data.pro.length}. Registros nutricion: ${data.nutri.length}. Medicamentos: ${data.medicamentos.length}.</p>
      <h2>Graficas de control de ciclos</h2>
      ${reportCharts(data.controles, days)}
      <h2>Peso mensual</h2>
      ${pesoMensualCard(resident)}
      <h2>Bitacora</h2>
      ${data.entries.map((entry) => `<div class="timeline ${entry.clase}"><b>${entry.fecha} | ${entry.tipo}</b><p>${entry.detalle}</p></div>`).join("") || "<p>Sin registros.</p>"}
      <h2>Medicamentos</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Remedio</th><th>Usuario</th><th>Cuidadora</th><th>Detalle</th></tr></thead>
          <tbody>${data.medicamentos.map((row) => `<tr><td>${medicamentoFecha(row)}</td><td>${row.medicamento || inferMedicamento(row.detalle)}</td><td>${row.usuario || usuarioCamPorTurno(row.turno)}</td><td>${row.cuidadora}</td><td>${row.detalle}</td></tr>`).join("") || `<tr><td colspan="5">Sin medicamentos en el periodo.</td></tr>`}</tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function printGeneratedPdf() {
  window.print();
}

function sendPdfByEmail(resident, days, email) {
  if (!isValidEmail(email)) {
    openModal("Enviar reporte", "Debe ingresar un correo valido antes de enviar el reporte.");
    return;
  }
  const data = reportData(resident, days);
  openModal(
    "Enviar reporte por mail",
    `Maqueta de envio: se enviaria el reporte de ${resident.nombre}, ultimos ${days} dias, a ${email}. Incluye ${data.entries.length} registros de bitacora y ${data.medicamentos.length} medicamentos.`,
    () => {}
  );
}

function renderPowerBi(view) {
  const days = Number(state.powerBiDays);
  const ready = Boolean(days);
  const data = ready ? powerBiExportData(days) : null;
  view.innerHTML = page("Power BI", "Extraccion completa de registros para analisis manual en Excel.") +
    `<div class="card">
      <h2>Exportar registros</h2>
      <div class="grid2">
        <div>
          <label>Periodo a extraer</label>
          <div class="period-selector">
            ${[15, 30, 45, 60, 75, 90].map((period) => `<button class="btn ${days === period ? "primary" : "secondary"} powerbi-period" data-days="${period}">${period} dias</button>`).join("")}
          </div>
        </div>
        <div class="form-actions">
          <button class="btn primary" id="powerBiExport" ${ready ? "" : "disabled"}>Descargar Excel</button>
        </div>
      </div>
      <div class="${ready ? "success" : "notice"}">
        ${ready ? `Listo para descargar todos los registros de los ultimos ${days} dias.` : "Seleccione 15, 30, 45, 60, 75 o 90 dias para habilitar la descarga."}
      </div>
    </div>
    ${ready ? powerBiPreview(data, days) : `<div class="card"><h2>Resumen exportable</h2><p>El resumen aparecera cuando seleccione un periodo.</p></div>`}`;
  attachPowerBiControls();
}

function attachPowerBiControls() {
  document.querySelectorAll(".powerbi-period").forEach((button) => {
    button.addEventListener("click", () => {
      state.powerBiDays = Number(button.dataset.days);
      renderView();
    });
  });
  const exportButton = $("powerBiExport");
  if (exportButton) {
    exportButton.addEventListener("click", () => downloadPowerBiExcel(Number(state.powerBiDays)));
  }
}

function powerBiPreview(data, days) {
  return `<div class="card">
    <h2>Resumen exportable</h2>
    ${metrics([
      { value: RESIDENTES.length, label: "Residentes" },
      { value: data.controles.length, label: "Controles ciclos" },
      { value: data.cam.length, label: "Registros CAM" },
      { value: data.medicamentos.length, label: "Medicamentos" }
    ])}
    ${metrics([
      { value: data.profesionales.length, label: "DT / Enfermero" },
      { value: data.nutricion.length, label: "Nutricion" },
      { value: data.peso.length, label: "Peso mensual" },
      { value: data.alertas.length, label: "Alertas" }
    ])}
    <div class="notice">El archivo Excel incluira secciones/tablas para residentes, controles, CAM, medicamentos, profesionales, nutricion, peso y alertas de los ultimos ${days} dias.</div>
  </div>`;
}

function powerBiExportData(days) {
  const today = new Date(2026, 5, 14, 23, 59);
  const start = daysBefore(today, days);
  const inPeriod = (row) => parseAnyDate(row.fecha || row.fecha_control) >= start && parseAnyDate(row.fecha || row.fecha_control) <= today;
  const cam = REGISTROS_CAM.filter(inPeriod).sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  const controles = CONTROLES_CICLOS.filter(inPeriod).sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  const profesionales = REGISTROS_PRO.filter(inPeriod).sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  const nutricion = REGISTROS_NUTRI.filter(inPeriod).sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  const medicamentos = cam.filter((row) => row.tipo.toLowerCase().includes("medicamento"));
  const peso = CONTROLES_PESO.filter(inPeriod).sort((a, b) => parseAnyDate(b.fecha) - parseAnyDate(a.fecha));
  const alertas = ALERTAS.filter(inPeriod).sort((a, b) => parseRegistroDate(b.fecha) - parseRegistroDate(a.fecha));
  return { cam, controles, profesionales, nutricion, medicamentos, peso, alertas };
}

function downloadPowerBiExcel(days) {
  const data = powerBiExportData(days);
  const html = `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #0f6f72; }
        h2 { margin-top: 24px; color: #273236; }
        table { border-collapse: collapse; margin-bottom: 20px; width: 100%; }
        th, td { border: 1px solid #b8c6c8; padding: 6px; vertical-align: top; }
        th { background: #e7eeee; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Exportacion Power BI / Excel</h1>
      <p>Periodo: ultimos ${days} dias. Generado desde maqueta local.</p>
      ${excelTable("Residentes", RESIDENTES, [
        ["ID", "id"], ["Nombre", "nombre"], ["RUT", "rut"], ["Sexo", "sexo"], ["Edad", "edad"], ["Estado", "estado"], ["Apoderado", "apoderado"], ["Mail apoderado", "mail"]
      ])}
      ${excelTable("Controles ciclos", data.controles, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["Temperatura", "temp"], ["Saturacion", "spo2"], ["Presion diastolica", "pad"], ["HGT", "hgt"]
      ])}
      ${excelTable("Registros CAM", data.cam, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["Usuario", "usuario"], ["Turno", "turno"], ["Cuidadora", "cuidadora"], ["Tipo", "tipo"], ["Detalle", "detalle"]
      ])}
      ${excelTable("Medicamentos", data.medicamentos, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["Usuario", "usuario"], ["Cuidadora", "cuidadora"], ["Medicamento", (row) => row.medicamento || inferMedicamento(row.detalle)], ["Detalle", "detalle"]
      ])}
      ${excelTable("DT Enfermero", data.profesionales, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["Rol", "rol"], ["Registro", "registro"]
      ])}
      ${excelTable("Nutricion", data.nutricion, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["IMC", "imc"], ["Observacion", "observacion"]
      ])}
      ${excelTable("Peso mensual", data.peso, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["Peso", "peso"], ["Regimen", "regimen"]
      ])}
      ${excelTable("Alertas", data.alertas, [
        ["Fecha", "fecha"], ["Residente", "residente"], ["Variable", "variable"], ["Valor", "valor"], ["Nivel", "nivel"], ["Accion", "accion"]
      ])}
    </body>
    </html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `export_powerbi_${days}_dias.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function excelTable(title, rows, columns) {
  return `<h2>${escapeHtml(title)}</h2>
    <table>
      <thead><tr>${columns.map(([header]) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.length ? rows.map((row) => `<tr>${columns.map(([, accessor]) => `<td>${escapeHtml(typeof accessor === "function" ? accessor(row) : row[accessor])}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">Sin registros</td></tr>`}
      </tbody>
    </table>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseAnyDate(value) {
  const text = String(value || "");
  if (/^\d{2}-\d{2}$/.test(text)) {
    const [day, month] = text.split("-").map(Number);
    return new Date(2026, month - 1, day, 0, 0);
  }
  return parseRegistroDate(text);
}

function go(view) {
  state.view = view;
  renderShell();
}

function openModal(title, text, onConfirm) {
  $("modalTitle").textContent = title;
  $("modalText").textContent = text;
  $("modal").classList.add("open");
  $("modal").setAttribute("aria-hidden", "false");
  $("modalConfirm").onclick = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };
}

function closeModal() {
  $("modal").classList.remove("open");
  $("modal").setAttribute("aria-hidden", "true");
}

init();
