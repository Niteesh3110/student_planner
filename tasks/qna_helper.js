export async function checkUpdateMeTooInput(questionId, func) {
  func = func.trim();
  if (!questionId || !func)
    throw { status: 400, error: "questionId or func invalid" };
  if (func !== "inc" && func !== "dec")
    throw { status: 400, error: "func not recognised" };
}
