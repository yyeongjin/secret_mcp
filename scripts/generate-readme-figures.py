"""Generate the data-backed academic figures embedded in README.md.

Install the plotting dependencies with:
    python3 -m pip install -r scripts/requirements-figures.txt
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RESULT_DIR = ROOT / "docs" / "assets" / "results"
VERIFICATION_PATH = RESULT_DIR / "isolation-verification.json"
RUN_DIR = (
    ROOT
    / "tmp"
    / "design-index"
    / "aviation-godot-20260730"
    / ".secret-mcp-runs"
    / "2026-07-29T15-54-10-483Z-5c70317e"
)
MANIFEST_PATH = RUN_DIR / "run.json"

BLUE = "#3B6FB6"
ORANGE = "#D9812C"
GREEN = "#2A8C69"
RED = "#B64B4B"
GRAY = "#D9DEE5"
DARK = "#222831"


def configure_style() -> None:
    sns.set_theme(context="paper", style="ticks", font="DejaVu Sans")
    mpl.rcParams.update(
        {
            "figure.dpi": 160,
            "savefig.dpi": 160,
            "svg.fonttype": "none",
            "axes.titlesize": 10,
            "axes.labelsize": 9,
            "xtick.labelsize": 8,
            "ytick.labelsize": 8,
            "legend.fontsize": 8,
            "axes.titleweight": "semibold",
            "axes.edgecolor": "#666666",
            "axes.linewidth": 0.8,
            "grid.color": "#E6E8EB",
            "grid.linewidth": 0.7,
        }
    )


def load_data() -> tuple[dict, dict]:
    verification = json.loads(VERIFICATION_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    return verification, manifest


def save_svg(fig: plt.Figure, filename: str) -> None:
    RESULT_DIR.mkdir(parents=True, exist_ok=True)
    fig.savefig(
        RESULT_DIR / filename,
        format="svg",
        bbox_inches="tight",
        facecolor="white",
        metadata={"Date": None, "Creator": "matplotlib"},
    )
    plt.close(fig)


def panel_label(ax: plt.Axes, label: str) -> None:
    ax.text(
        -0.12,
        1.08,
        label,
        transform=ax.transAxes,
        fontsize=11,
        fontweight="bold",
        va="top",
    )


def rounded_box(
    ax: plt.Axes,
    x: float,
    y: float,
    width: float,
    height: float,
    label: str,
    facecolor: str,
    edgecolor: str,
) -> None:
    patch = FancyBboxPatch(
        (x, y),
        width,
        height,
        boxstyle="round,pad=0.015,rounding_size=0.025",
        linewidth=1.0,
        edgecolor=edgecolor,
        facecolor=facecolor,
    )
    ax.add_patch(patch)
    ax.text(x + width / 2, y + height / 2, label, ha="center", va="center", fontsize=8)


def generate_isolation_figure(verification: dict) -> None:
    requests = verification["samplingRequests"]
    reference_ids = [request["referenceId"] for request in requests]
    incidence = np.eye(len(requests), dtype=int)

    fig = plt.figure(figsize=(10.2, 3.35), constrained_layout=True)
    grid = fig.add_gridspec(1, 2, width_ratios=[0.9, 1.6])
    ax_matrix = fig.add_subplot(grid[0, 0])
    ax_flow = fig.add_subplot(grid[0, 1])

    sns.heatmap(
        incidence,
        ax=ax_matrix,
        annot=True,
        fmt="d",
        cmap=mpl.colors.ListedColormap(["#F4F5F7", BLUE]),
        cbar=False,
        square=True,
        linewidths=1.2,
        linecolor="white",
        xticklabels=reference_ids,
        yticklabels=[f"request {index + 1}" for index in range(len(requests))],
        annot_kws={"fontsize": 11, "fontweight": "bold"},
    )
    ax_matrix.set_title("Reference-ID incidence", pad=10)
    ax_matrix.set_xlabel("Reference ID present in request")
    ax_matrix.set_ylabel("Sampling request")
    ax_matrix.tick_params(axis="x", rotation=25)
    ax_matrix.tick_params(axis="y", rotation=0)
    panel_label(ax_matrix, "(a)")

    ax_flow.set_xlim(0, 1)
    ax_flow.set_ylim(0, 1)
    ax_flow.axis("off")
    ax_flow.set_title("Observed one-to-one request and artifact mapping", pad=10)
    panel_label(ax_flow, "(b)")

    lane_y = [0.67, 0.27]
    for index, (request, y) in enumerate(zip(requests, lane_y, strict=True), start=1):
        rounded_box(ax_flow, 0.02, y, 0.22, 0.15, request["referenceId"], "#F3F6FA", "#7B8794")
        rounded_box(
            ax_flow,
            0.39,
            y,
            0.25,
            0.15,
            f"q{index}\n{request['imageCount']} images",
            "#EAF1FA",
            BLUE,
        )
        rounded_box(
            ax_flow,
            0.79,
            y,
            0.19,
            0.15,
            f"D{index}\n1 file",
            "#EDF7F3",
            GREEN,
        )
        for start, end in [((0.24, y + 0.075), (0.39, y + 0.075)), ((0.64, y + 0.075), (0.79, y + 0.075))]:
            ax_flow.add_patch(
                FancyArrowPatch(start, end, arrowstyle="-|>", mutation_scale=10, linewidth=1.0, color=DARK)
            )

    ax_flow.plot([0.32, 0.32], [0.18, 0.89], linestyle="--", color=GRAY, linewidth=1)
    ax_flow.plot([0.71, 0.71], [0.18, 0.89], linestyle="--", color=GRAY, linewidth=1)
    ax_flow.text(0.515, 0.93, "MCP sampling/createMessage", ha="center", fontsize=8, color=DARK)
    ax_flow.text(
        0.5,
        0.04,
        "includeContext = none   ·   cross-reference ID matches = 0   ·   output documents = 2",
        ha="center",
        fontsize=8,
        color="#4E5968",
    )

    save_svg(fig, "fig1-protocol-isolation.svg")


def document_measurements(manifest: dict) -> list[dict]:
    measurements: list[dict] = []
    for item in manifest["items"]:
        document = (RUN_DIR / item["documentPath"]).read_text(encoding="utf-8")
        required_sections = sum(
            bool(re.search(rf"^## {section}\. ", document, re.MULTILINE))
            for section in range(1, 20)
        )
        measurements.append(
            {
                "reference_id": item["referenceId"],
                "tokens": len(document.split()),
                "lines": len(document.splitlines()),
                "kilobytes": len(document.encode("utf-8")) / 1000,
                "sections": required_sections,
            }
        )
    return measurements


def evidence_measurements(manifest: dict) -> list[dict]:
    measurements: list[dict] = []
    for item in manifest["items"]:
        desktop = next(evidence for evidence in item["evidence"] if evidence["sourceKind"] == "desktop")
        measurements.append(
            {
                "reference_id": item["referenceId"],
                "source_height": desktop["sourceHeight"],
                "images": len(item["evidence"]),
                "payload_kb": sum(evidence["byteLength"] for evidence in item["evidence"]) / 1000,
                "palette_samples": sum(
                    len(evidence["representativeColors"]) for evidence in item["evidence"]
                ),
            }
        )
    return measurements


def generate_run_figure(manifest: dict) -> None:
    evidence = evidence_measurements(manifest)
    documents = document_measurements(manifest)
    ids = [row["reference_id"] for row in evidence]
    x = np.arange(len(ids))

    fig, axes = plt.subplots(2, 2, figsize=(10.4, 6.2), constrained_layout=True)
    ax_a, ax_b, ax_c, ax_d = axes.flat

    ax_a.scatter(
        [row["source_height"] for row in evidence],
        [row["images"] for row in evidence],
        s=58,
        color=BLUE,
        edgecolor="white",
        linewidth=0.8,
        zorder=3,
    )
    for row in evidence:
        ax_a.annotate(
            row["reference_id"].replace("gdweb-", ""),
            (row["source_height"], row["images"]),
            xytext=(5, 4),
            textcoords="offset points",
            fontsize=7.5,
        )
    ax_a.set_xlabel("Desktop source height (px)")
    ax_a.set_ylabel("Prepared evidence images")
    ax_a.set_title("Evidence tiling by source height")
    ax_a.grid(True, linestyle=":")
    panel_label(ax_a, "(a)")

    ax_b.scatter(
        [row["payload_kb"] for row in evidence],
        [row["palette_samples"] for row in evidence],
        s=58,
        color=ORANGE,
        edgecolor="white",
        linewidth=0.8,
        zorder=3,
    )
    for row in evidence:
        ax_b.annotate(
            row["reference_id"].replace("gdweb-", ""),
            (row["payload_kb"], row["palette_samples"]),
            xytext=(5, 4),
            textcoords="offset points",
            fontsize=7.5,
        )
    ax_b.set_xlabel("Prepared image payload (decimal KB)")
    ax_b.set_ylabel("Representative-color measurements")
    ax_b.set_title("Evidence payload and palette measurements")
    ax_b.grid(True, linestyle=":")
    panel_label(ax_b, "(b)")

    token_values = np.array([row["tokens"] for row in documents]) / 1000
    line_values = np.array([row["lines"] for row in documents])
    ax_c.bar(x, token_values, color=BLUE, width=0.58, label="Whitespace tokens (×10³)")
    ax_c.set_xticks(x, [identifier.replace("gdweb-", "") for identifier in ids])
    ax_c.set_xlabel("Reference ID")
    ax_c.set_ylabel("Whitespace tokens (×10³)", color=BLUE)
    ax_c.tick_params(axis="y", labelcolor=BLUE)
    ax_c_secondary = ax_c.twinx()
    ax_c_secondary.plot(x, line_values, color=RED, marker="o", linewidth=1.5, label="Lines")
    ax_c_secondary.set_ylabel("Lines", color=RED)
    ax_c_secondary.tick_params(axis="y", labelcolor=RED)
    ax_c.set_title("Generated DESIGN_INDEX size")
    panel_label(ax_c, "(c)")
    handles = [ax_c.patches[0], ax_c_secondary.lines[0]]
    ax_c.legend(handles, ["Whitespace tokens (×10³)", "Lines"], frameon=False, loc="upper left")

    coverage = np.array(
        [
            [
                int(bool(re.search(rf"^## {section}\. ", (RUN_DIR / item["documentPath"]).read_text(encoding="utf-8"), re.MULTILINE)))
                for section in range(1, 20)
            ]
            for item in manifest["items"]
        ]
    )
    sns.heatmap(
        coverage,
        ax=ax_d,
        cmap=mpl.colors.ListedColormap(["#F4F5F7", GREEN]),
        vmin=0,
        vmax=1,
        cbar=False,
        linewidths=0.5,
        linecolor="white",
        xticklabels=list(range(1, 20)),
        yticklabels=[identifier.replace("gdweb-", "") for identifier in ids],
    )
    ax_d.set_xlabel("Required contract section")
    ax_d.set_ylabel("Reference ID")
    ax_d.set_title("Required heading presence (19/19 each)")
    ax_d.tick_params(axis="x", rotation=0, labelsize=6.5)
    ax_d.tick_params(axis="y", rotation=0)
    panel_label(ax_d, "(d)")

    save_svg(fig, "fig2-recorded-run-measurements.svg")


def fit_image(image: Image.Image, target_ratio: float) -> Image.Image:
    width, height = image.size
    current_ratio = width / height
    if current_ratio > target_ratio:
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        return image.crop((left, 0, left + new_width, height))
    new_height = int(width / target_ratio)
    top = max(0, (height - new_height) // 2)
    return image.crop((0, top, width, min(height, top + new_height)))


def generate_qualitative_figure() -> None:
    panels = [
        ("(a) Evidence and measurements", ROOT / "tmp/showcase/aviation-godot/screenshots/02-evidence-view.png"),
        ("(b) Per-reference DESIGN_INDEX", ROOT / "tmp/showcase/aviation-godot/screenshots/01-design-index-view.png"),
        ("(c) Specification-driven implementation", ROOT / "tmp/showcase/aviation-godot/screenshots/05-generated-site-hero.png"),
    ]
    fig, axes = plt.subplots(1, 3, figsize=(12.0, 4.2), constrained_layout=True)
    target_ratio = 1.42
    for ax, (title, image_path) in zip(axes, panels, strict=True):
        image = fit_image(Image.open(image_path).convert("RGB"), target_ratio)
        ax.imshow(image)
        ax.set_title(title, loc="left", pad=7)
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_visible(True)
            spine.set_linewidth(0.8)
            spine.set_edgecolor("#777777")

    fig.text(0.335, 0.49, "→", ha="center", va="center", fontsize=19, color="#555555")
    fig.text(0.665, 0.49, "→", ha="center", va="center", fontsize=19, color="#555555")
    save_svg(fig, "fig3-qualitative-case-study.svg")


def main() -> None:
    configure_style()
    verification, manifest = load_data()
    generate_isolation_figure(verification)
    generate_run_figure(manifest)
    generate_qualitative_figure()
    print(f"Generated academic README figures in {RESULT_DIR}")


if __name__ == "__main__":
    main()
