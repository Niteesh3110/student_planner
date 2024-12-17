export async function checkUpdateMeTooInput(questionId, func) {
  func = func.trim();
  if (!questionId || !func)
    throw { status: 400, error: "questionId or func invalid" };
  if (func !== "inc" && func !== "dec")
    throw { status: 400, error: "func not recognised" };
}

export async function checkLikeInput(answerUserId, answerId, questionId, func) {
  func = func.trim();
  if (!answerUserId || !questionId || !answerId || !func)
    throw { status: 400, error: "answerId or questionId or func invalid" };
  if (func !== "inc" && func !== "dec")
    throw { status: 400, error: "func not recognised" };
}
