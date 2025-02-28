// universalAdd.js

async function fetchTableColumns(tableName) {
  const response = await fetch(`/api/tableColumns?table=${tableName}`);
  const columns = await response.json();
  return columns;
}

function generateForm(columns) {
  const form = document.createElement("form");
  form.id = "add-form";

  columns.forEach((column) => {
    if (column.column_name !== "id" && !column.column_name.endsWith("_id")) {
      const label = document.createElement("label");
      label.textContent = column.column_name;
      label.setAttribute("for", column.column_name);

      const input = document.createElement("input");
      input.type = "text";
      input.id = column.column_name;
      input.name = column.column_name;

      form.appendChild(label);
      form.appendChild(input);
    }
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add";

  form.appendChild(submitButton);

  return form;
}

async function addBtn(tableName) {
  const columns = await fetchTableColumns(tableName);
  const form = generateForm(columns);

  const formContainer = document.getElementById("form-container");
  formContainer.innerHTML = "";
  formContainer.appendChild(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(`/api/add/${tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Data added successfully");
        form.reset();
        // Optionally, refresh the table or perform other actions
      } else {
        alert("Failed to add data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}
