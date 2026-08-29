import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProjectCategory, groupProjectsByCategory } from "./projectGrouping.js";

test("normalizeProjectCategory keep common category names consistent", () => {
  assert.equal(normalizeProjectCategory("front-end"), "Front-end");
  assert.equal(normalizeProjectCategory("back end"), "Back end");
  assert.equal(normalizeProjectCategory("fullstack"), "Fullstack");
  assert.equal(normalizeProjectCategory(""), "General");
});

test("groupProjectsByCategory groups items by category only", () => {
  const projects = [
    { id: 1, category: "front-end", title: "Alpha" },
    { id: 2, category: "front-end", title: "Beta" },
    { id: 3, category: "back end", title: "Gamma" },
    { id: 4, category: "fullstack", title: "Delta" },
  ];

  const grouped = groupProjectsByCategory(projects);

  assert.deepEqual(grouped.map((group) => group.category), ["Front-end", "Back end", "Fullstack"]);
  assert.deepEqual(grouped[0].projects.map((project) => project.title), ["Alpha", "Beta"]);
  assert.deepEqual(grouped[1].projects.map((project) => project.title), ["Gamma"]);
  assert.deepEqual(grouped[2].projects.map((project) => project.title), ["Delta"]);
});
