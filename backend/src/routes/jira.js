const router = require("express").Router();
const axios = require("axios");

// ✅ auth import that works with both export styles
const authModule = require("../middleware/auth");
const auth = authModule.auth || authModule.requireAuth || authModule;

function jiraAuthHeader() {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  const base64 = Buffer.from(`${email}:${token}`).toString("base64");
  return `Basic ${base64}`;
}

router.post("/create-issue", auth, async (req, res) => {
  try {
    const { summary, description } = req.body || {};
    if (!summary) return res.status(400).json({ message: "summary is required" });

    const baseURL = process.env.JIRA_BASE_URL;
    const projectKey = process.env.JIRA_PROJECT_KEY;

    if (!baseURL || !projectKey) {
      return res.status(400).json({ message: "Missing JIRA_BASE_URL or JIRA_PROJECT_KEY in .env" });
    }

    const response = await axios.post(
      `${baseURL}/rest/api/3/issue`,
      {
        fields: {
          project: { key: projectKey },
          summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              { type: "paragraph", content: [{ type: "text", text: description || "" }] },
            ],
          },
          issuetype: { name: "Task" },
        },
      },
      {
        headers: {
          Authorization: jiraAuthHeader(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const key = response.data.key;

    res.status(201).json({
      message: "Jira issue created",
      issueKey: key,
      issueUrl: `${baseURL}/browse/${key}`,
    });
  } catch (err) {
    console.error("JIRA ERROR:", err.response?.data || err.message);
    res.status(500).json({
      message: "Failed to create Jira issue",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;