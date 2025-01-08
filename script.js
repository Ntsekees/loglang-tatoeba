
var g_data = [];
function highlight_row(row) {
	var t = row.constructor.name;
	console.assert(
		t === "HTMLTableRowElement",
		"⟦row⟧ is not an HTMLTableRowElement but a " + t + "!");
	// Remove highlight from previously selected row, if any
	const previously_selected_row =
		document.querySelector('tr.selected');
	if (previously_selected_row) {
		previously_selected_row.classList.remove('selected');
	}
	// Highlight the clicked row
	row.classList.add('selected');
}
function shift_selected_row(n) {
	const previously_selected_row =
		document.querySelector('tr.selected');
	if (previously_selected_row) {
		const newly_selected_row = (n > 0)
			? previously_selected_row.previousElementSibling
			: previously_selected_row.nextElementSibling;
		if (newly_selected_row) {
			highlight_row(newly_selected_row);
			update_details(newly_selected_row);
		}
	}
}
function handle_keydown(e) {
	e = e || window.event;
	if (e.keyCode == "38") {
		shift_selected_row(1);
	} else if (e.keyCode == "40") {
		shift_selected_row(-1);
	}
}
function fmt(s) {
	if (s.includes("\n")) {
		var c = "";
		s.split("\n").forEach((e, i, l) => {
			c += "<tr><td>" + e + "</td></tr>";
		});
		s = "<table>" + c + "</table>";
	}
	return s;
}
function update_details(row) {
	var content = "";
	if (row.childElementCount > 0) {
		var first = "";
		for (const child of row.children) {
			first = child.innerText;
			break;
		}
		var entry = g_data.find((e) => e["English"] == first);
		for (var key in entry) {
			if (["English", "Context"].includes(key)) continue;
			content += `
						<tr>
							<td class="lang-td">
								${key}
							</td>
							<td class="trans-td">
								${fmt(entry[key])}
							</td>
						</tr>
			`;
		}
	}
	document.getElementById("details-body").innerHTML = content;
}
function setup() {
	fetch('./data.json')
    .then((response) => response.json())
    .then((json) => setup_2(json))
}
function setup_2(data) {
	g_data = data;
	var content = "";
	for (const row of g_data) {
		content += `
						<tr>
							<td class="eng-td">
								${row["English"]}
							</td>
							<td class="ctx-td">
								${row["Context"]}
							</td>
						</tr>
		`;
	}
	document.getElementById("entries-body").innerHTML = content;
	const rows = document.querySelectorAll('.entries tr');
	for (let i = 0; i < rows.length; i++) {
		rows[i].onclick = function() {
			highlight_row(this);
			update_details(this);
		};
	}
	document.addEventListener('keydown', handle_keydown, true);
} 

setup();

