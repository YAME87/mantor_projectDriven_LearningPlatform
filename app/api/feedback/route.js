// AI task feedback.
// The browser sends the task, the submission, and the mentor's criteria.
// Claude scores the submission against each criterion and returns structured feedback.
// Without ANTHROPIC_API_KEY, a simulated response is returned so the demo still works.
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a supportive industry mentor reviewing work from a beginner learner on a project-based learning platform.
Score the submission ONLY against the mentor's criteria provided.
For each criterion give a score from 1 to 5 (1 = not shown, 3 = partly meets, 5 = fully meets) and one specific, actionable comment.
Be encouraging but honest. Point to what is in the submission. Never invent work that is not there.
Write in plain English that a beginner understands.`;

const FEEDBACK_TOOL = {
  name: "give_feedback",
  description: "Return structured feedback on the learner's submission.",
  input_schema: {
    type: "object",
    properties: {
      scores: {
        type: "array",
        items: {
          type: "object",
          properties: {
            criteriaId: { type: "string" },
            score: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
          required: ["criteriaId", "score", "comment"],
        },
      },
      summary: {
        type: "string",
        description: "2 to 3 sentences: what went well and the single most useful next step.",
      },
    },
    required: ["scores", "summary"],
  },
};

function buildPrompt({ project, task, submission, contributions }) {
  const criteria = project.criteria.filter((c) => task.criteriaIds.includes(c.id));
  return [
    `Project: ${project.title}`,
    `Project scenario: ${project.description}`,
    ``,
    `Task: ${task.title}`,
    `Task instructions: ${task.description}`,
    ``,
    `Mentor's criteria for this task:`,
    ...criteria.map((c) => `* [${c.id}] ${c.name}: ${c.description}`),
    ``,
    `Team contributions recorded for this task:`,
    ...(contributions.length
      ? contributions.map((c) => `* ${c.description} (${c.hoursSpent}h)`)
      : ["* none recorded"]),
    ``,
    `Submission:`,
    submission.content,
  ].join("\n");
}

function simulatedFeedback({ project, task, submission }) {
  const criteria = project.criteria.filter((c) => task.criteriaIds.includes(c.id));
  const length = submission.content.trim().length;
  const score = Math.max(2, Math.min(4, Math.round(length / 120) + 2));
  return {
    scores: criteria.map((c) => ({
      criteriaId: c.id,
      score,
      comment: `Check your work against this standard: "${c.description}" Add specific evidence that shows you met it.`,
    })),
    summary:
      "This is simulated feedback because no Claude API key is set. Add ANTHROPIC_API_KEY to .env.local to get real AI feedback based on the mentor's criteria.",
    simulated: true,
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { project, task, submission } = body || {};
  if (!project || !task || !submission?.content) {
    return Response.json({ error: "Project, task and submission are required" }, { status: 400 });
  }
  const contributions = body.contributions || [];

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(simulatedFeedback({ project, task, submission }));
  }

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      tools: [FEEDBACK_TOOL],
      tool_choice: { type: "tool", name: FEEDBACK_TOOL.name },
      messages: [{ role: "user", content: buildPrompt({ project, task, submission, contributions }) }],
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    if (!toolUse) throw new Error("Claude did not return feedback");

    const validIds = new Set(task.criteriaIds);
    const scores = (toolUse.input.scores || [])
      .filter((s) => validIds.has(s.criteriaId))
      .map((s) => ({
        criteriaId: s.criteriaId,
        score: Math.max(1, Math.min(5, Math.round(Number(s.score) || 1))),
        comment: String(s.comment || ""),
      }));

    return Response.json({ scores, summary: String(toolUse.input.summary || ""), simulated: false });
  } catch (error) {
    console.error("AI feedback failed:", error);
    return Response.json(
      { error: "AI feedback failed. Check your API key and model name, then try again." },
      { status: 502 }
    );
  }
}
