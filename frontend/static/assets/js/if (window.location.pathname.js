if (window.location.pathname.includes('edit-course.html')) {
// At the top of your script block
let courseData = null; 
let currentEditingEpisodeId = null;
let currentEditingLessonId = null;

$(document).ready(function () {
    $('#language').selectpicker();
});

    window.openUpdateTopicModal = function(episodeId) {
        currentEditingEpisodeId = episodeId;
        if (courseData) {
            const topic = courseData.episodes.find(ep => ep._id == episodeId);
            if (topic) {
                document.getElementById('update-topic-title').value = topic.title;
                document.getElementById('update-topic-summary').value = topic.summary || '';
            }
        }
    }

    window.openUpdateLessonModal = function(episodeId, lessonId) {
        // --- THIS IS THE NEW LINE TO FIX THE ERROR ---
    const courseId = new URLSearchParams(window.location.search).get('courseId');
        currentEditingEpisodeId = episodeId;
        currentEditingLessonId = lessonId;
        if (courseData) {
            const episode = courseData.episodes.find(ep => ep._id == episodeId);
            if (episode) {
                const lesson = episode.lessons.find(les => les._id == lessonId);
                if (lesson) {
                    document.getElementById('lesson-title').value = lesson.title || '';
                    document.getElementById('lesson-summary').value = lesson.summary || '';
                    document.getElementById('lesson-video-source').value = lesson.vimeoUrl ? 'Vimeo' : 'Select Video Source';
                    document.getElementById('lesson-video-url').value = lesson.vimeoUrl || '';
                    const durationMatch = lesson.duration ? lesson.duration.match(/(\d+)\s*hr\s*(\d+)\s*min\s*(\d+)\s*sec/) : null;
                    document.getElementById('lesson-duration-hr').value = durationMatch ? durationMatch[1] : '0';
                    document.getElementById('lesson-duration-min').value = durationMatch ? durationMatch[2] : '0';
                    document.getElementById('lesson-duration-sec').value = durationMatch ? durationMatch[3] : '0';
                    document.getElementById('lesson-is-preview').checked = lesson.isPreview || false;
                    const modal = document.getElementById('Lesson');
                    modal.querySelector('.modal-title').textContent = 'Update Lesson';
                    modal.querySelector('#save-lesson-btn').innerHTML = `
                        <span class="icon-reverse-wrapper">
                            <span class="btn-text">Update Lesson</span>
                            <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                            <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                        </span>
                    `;
                    // START: Add this new code block
const existingFilesContainer = document.getElementById('existing-exercise-files');
const newFilesListContainer = document.getElementById('new-files-list');
const fileInput = document.getElementById('lesson-exercise-files');

// Clear any previous state
existingFilesContainer.innerHTML = '';
newFilesListContainer.innerHTML = '';
fileInput.value = ''; // Reset file input

if (lesson.exerciseFiles && lesson.exerciseFiles.length > 0) {
    let filesHtml = '<p class="b3 mb-2">Attached Files:</p><br><ul class="list-group list-group-flush">';
    lesson.exerciseFiles.forEach(file => {
        // NOTE: The file.path should be the URL to access the file, e.g., 'uploads/courses/file.pdf'
        filesHtml += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <a href="/${file.path}" target="_blank">${file.filename}</a>
                <button type="button" class="btn btn-sm btn-outline-danger remove-existing-file-btn"
                        data-course-id="${courseId}"
                        data-episode-id="${episodeId}"
                        data-lesson-id="${lessonId}"
                        data-file-path="${file.path}">
                    Remove
                </button>
            </li>
        `;
    });
    filesHtml += '</ul>';
    existingFilesContainer.innerHTML = filesHtml;
}
// END: New code block
                }
            }
        }
    }

const renderCourseBuilder = (episodes) => {
    console.trace('renderCourseBuilder was called'); // <-- ADD THIS LINE
    const container = document.getElementById('course-builder-topics-container');
    if (!container) return;

    if (!episodes || episodes.length === 0) {
        container.innerHTML = '<p>No topics yet. Click "Add New Topic" to get started.</p>';
        return;
    }

    container.innerHTML = episodes.map((episode) => {
        const items = [
            ...(episode.lessons || []).map(item => ({ ...item, type: 'lesson' })),
            ...(episode.quizzes || []).map(item => ({ ...item, type: 'quiz' })),
            ...(episode.assignments || []).map(item => ({ ...item, type: 'assignment' }))
        ];

        const itemsHtml = items.map(item => {
            let iconClass = '';
            let editTargetModal = '';

            switch (item.type) {
                case 'lesson':
                    iconClass = 'feather-play-circle';
                    editTargetModal = '#Lesson';
                    break;
                case 'quiz':
                    iconClass = 'feather-help-circle';
                    editTargetModal = '#Quiz';
                    break;
                case 'assignment':
                    iconClass = 'feather-clipboard';
                    editTargetModal = '#Assignment';
                    break;
            }

            return `
            <div class="d-flex justify-content-between rbt-course-wrape mb-4">
                <div class="col-10 inner d-flex align-items-center gap-2">
                    <i class="${iconClass}"></i>
                    <h6 class="rbt-title mb-0">${item.title}</h6>
                    ${item.exerciseFiles && item.exerciseFiles.length > 0 ? '<i class="feather-paperclip ms-2"></i>' : ''}
                </div>
                <div class="col-2 inner">
                    <ul class="rbt-list-style-1 rbt-course-list d-flex gap-2">
                        <li>
                            <i class="feather-trash delete-item" 
                               data-episode-id="${episode._id}" 
                               data-item-id="${item._id}" 
                               data-item-type="${item.type}"></i>
                        </li>
                        <li>
                            <i class="feather-edit edit-item" 
                               data-bs-toggle="modal" 
                               data-bs-target="${editTargetModal}"
                               data-episode-id="${episode._id}" 
                               data-item-id="${item._id}" 
                               data-item-type="${item.type}"></i>
                        </li>
                    </ul>
                </div>
            </div>
            `;
        }).join('');

        return `
        <div class="accordion-item card mb--20">
            <h2 class="accordion-header card-header rbt-course">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#episode-collapse-${episode._id}">
                    ${episode.title}
                </button>
                <span class="rbt-course-icon rbt-course-edit" data-bs-toggle="modal" data-bs-target="#UpdateTopic" onclick="openUpdateTopicModal('${episode._id}')"></span>
                <span class="rbt-course-icon rbt-course-del" data-episode-id="${episode._id}"></span>
            </h2>
            <div id="episode-collapse-${episode._id}" class="accordion-collapse collapse">
                <div class="accordion-body card-body">
                    ${itemsHtml || '<p class="mb-4">No content yet. Use the buttons below to add some.</p>'}
                    
                    <div class="d-flex flex-wrap justify-content-between align-items-center mt-4">
                        <div class="gap-3 d-flex flex-wrap">
                            <button class="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2 add-content-btn" type="button" data-bs-toggle="modal" data-bs-target="#Lesson" data-episode-id="${episode._id}">
                                <span class="icon-reverse-wrapper"><span class="btn-text">Lesson</span><span class="btn-icon"><i class="feather-plus-square"></i></span><span class="btn-icon"><i class="feather-plus-square"></i></span></span>
                            </button>
                            <button class="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2 add-content-btn" type="button" data-bs-toggle="modal" data-bs-target="#Quiz" data-episode-id="${episode._id}">
                                <span class="icon-reverse-wrapper"><span class="btn-text">Quiz</span><span class="btn-icon"><i class="feather-plus-square"></i></span><span class="btn-icon"><i class="feather-plus-square"></i></span></span>
                            </button>
                            <button class="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2 add-content-btn" type="button" data-bs-toggle="modal" data-bs-target="#Assignment" data-episode-id="${episode._id}">
                                <span class="icon-reverse-wrapper"><span class="btn-text">Assignments</span><span class="btn-icon"><i class="feather-plus-square"></i></span><span class="btn-icon"><i class="feather-plus-square"></i></span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
};

// --- DELETE ITEM (Lesson, Quiz, Assignment) ---
document.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-item');
    if (!deleteBtn) return;

    const { episodeId, itemId, itemType } = deleteBtn.dataset;
    const courseId = new URLSearchParams(window.location.search).get('courseId');
    let itemTypeName = itemType.charAt(0).toUpperCase() + itemType.slice(1); // Capitalizes 'quiz' to 'Quiz'

    if (confirm(`Are you sure you want to delete this ${itemTypeName}?`)) {
        try {
            // The URL is built dynamically based on the item type (e.g., /lessons/, /quizzes/)
let pathSegment = `${itemType}s`;
if (itemType === 'quiz') {
    pathSegment = 'quizzes';
}
const url = `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/${pathSegment}/${itemId}`;

             // --- ADD THIS DEBUGGING LOG ---
            console.log("Attempting to send DELETE request to this URL:", url);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            const result = await response.json();

            if (result.success) {
                courseData = result.course;
                renderCourseBuilder(courseData.episodes);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error(`Error deleting ${itemType}:`, error);
            alert(`An error occurred while deleting the ${itemTypeName}.`);
        }
    }
});

const updatePreviewButton = (isMasterclass) => {
    const courseId = new URLSearchParams(window.location.search).get('courseId');
    const previewBtn = document.getElementById('preview-course-btn');
    if (previewBtn) {
        if (isMasterclass) {
            // If it's a masterclass, link to the new details page
            previewBtn.setAttribute('data-href', `masterclass-details.html?courseId=${courseId}`);
        } else {
            // Otherwise, link to the standard course details page
            previewBtn.setAttribute('data-href', `course-details.html?courseId=${courseId}`);
        }
    }
};

    window.onload = function() {
        const masterclassSwitch = document.getElementById('is-masterclass-switch');
        // --- AUTH & URL CHECK ---
        if (!token || (user && user.role !== 'instructor')) {
            alert("Access Denied.");
            window.location.href = '/login.html';
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('courseId');
        if (!courseId) {
            alert('No course ID found.');
            window.location.href = 'instructor-course.html';
            return;
        }
         // --- NEW DEBUGGING LOGS ---
        console.log('--- DEBUGGING DATA LOAD ---');                               // <-- ADD THIS
        console.log('Window Location Search:', window.location.search);          // <-- ADD THIS
        console.log('Parsed courseId from URL:', courseId);                       // <-- ADD THIS
        // --- END DEBUGGING LOGS ---

// --- FINAL, COMPLETE QUIZ LOGIC (ADD/EDIT/NAVIGATE/SAVE) ---
let currentEditingQuizId = null;
let currentEditingQuestionId = null;

window.openUpdateQuizModal = function(episodeId, quizId) {
    currentEditingEpisodeId = episodeId;
    currentEditingQuizId = quizId;
    if (courseData) {
        const episode = courseData.episodes.find(ep => ep._id == episodeId);
        if (episode && episode.quizzes) {
            const quiz = episode.quizzes.find(q => q._id == quizId);
            if (quiz) {
                document.getElementById('quiz-title').value = quiz.title || '';
                document.getElementById('quiz-summary').value = quiz.summary || '';
                renderQuizQuestionsList();
            }
        }
    }
};

// --- FINAL, COMPLETE QUIZ LOGIC (ADD/EDIT/NAVIGATE/SAVE) ---
// This is a self-contained block. You can replace your old quiz code with this.
// --- FINAL, COMPLETE QUIZ LOGIC (INCLUDES ALL SETTINGS) ---
(() => {
    if (!document.getElementById('Quiz')) {
        return;
    }

    // --- 1. STATE MANAGEMENT ---
    let currentEditingEpisodeId = null;
    let currentEditingQuizId = null;
    let currentEditingQuestionId = null;
    const steps = { INFO: 1, QUESTIONS_LIST: 2, ADD_EDIT_QUESTION_FORM: 3, SETTINGS: 4 };
    let currentStep = steps.INFO;

    // --- 2. ELEMENT SELECTORS ---
    const quizModalEl = document.getElementById('Quiz');
    const backBtn = document.getElementById('quiz-back-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const finalSaveQuizBtn = document.getElementById('quiz-save-final-btn');
    const quizTitleInput = document.getElementById('quiz-title');
    const quizSummaryInput = document.getElementById('quiz-summary');
    const questionsListContainer = document.getElementById('quiz-questions-list');
    const addNewQuestionBtn = document.getElementById('add-question-btn');
    const questionTextInput = document.getElementById('quiz-question-text');
    const questionTypeSelect = document.getElementById('quiz-question-type');
    const questionPointsInput = document.getElementById('quiz-question-points');
    const answerOptionsWrapper = document.getElementById('quiz-answer-options-wrapper');
    const answerOptionsContainer = document.getElementById('quiz-answer-options-container');
    const addAnswerOptionBtn = document.getElementById('add-answer-option-btn');
    const saveQuestionBtn = document.getElementById('add-question-save-btn');
    const cancelQuestionBtn = document.getElementById('cancel-question-btn');

    // Selectors for the Settings tab
    const settingsForm = document.getElementById('question-4');
    const timeLimitValueInput = settingsForm.querySelector('#modal-field-3');
    const timeLimitUnitSelect = settingsForm.querySelector('select');
    const hideTimeLimitCheckbox = settingsForm.querySelector('#switchCheckAnswerTwo2');
    const feedbackModeRadios = settingsForm.querySelectorAll('input[name="rbt-radio"]');
    const passingGradeInput = settingsForm.querySelector('#modal-field-4');
    const maxQuestionsInput = settingsForm.querySelector('#modal-field-5');
    const autoStartCheckbox = settingsForm.querySelector('#autoStart');
    const questionOrderSelect = settingsForm.querySelectorAll('select.w-100.rbt-select-dark')[0];
    const questionLayoutSelect = settingsForm.querySelectorAll('select.w-100.rbt-select-dark')[1];
    const hideQuestionNumberCheckbox = settingsForm.querySelector('#hideNumber');
    const shortAnswerLimitInput = settingsForm.querySelector('#modal-field-sort-answer');
    const essayLimitInput = settingsForm.querySelector('#modal-field-7');

    // --- 3. HELPER & RENDERING FUNCTIONS ---

    const updateModalButtonsAndProgress = () => {
        const progressbar = quizModalEl.querySelector('.progress-bar');
        const progressButtons = quizModalEl.querySelectorAll('.quiz-modal-btn');
        progressButtons.forEach(btn => btn.classList.remove('quiz-modal__active'));
        let progressWidth = '0%';
        if (currentStep === steps.INFO) {
            progressWidth = '33.33%';
            if (progressButtons[0]) progressButtons[0].classList.add('quiz-modal__active');
        } else if (currentStep === steps.QUESTIONS_LIST || currentStep === steps.ADD_EDIT_QUESTION_FORM) {
            progressWidth = '66.66%';
            if (progressButtons[0]) progressButtons[0].classList.add('quiz-modal__active');
            if (progressButtons[1]) progressButtons[1].classList.add('quiz-modal__active');
        } else if (currentStep === steps.SETTINGS) {
            progressWidth = '100%';
            progressButtons.forEach(btn => btn.classList.add('quiz-modal__active'));
        }
        if (progressbar) progressbar.style.width = progressWidth;
        backBtn.style.display = (currentStep === steps.QUESTIONS_LIST || currentStep === steps.SETTINGS) ? 'inline-block' : 'none';
        nextBtn.style.display = (currentStep === steps.INFO || currentStep === steps.QUESTIONS_LIST) ? 'inline-block' : 'none';
        finalSaveQuizBtn.style.display = currentStep === steps.SETTINGS ? 'inline-block' : 'none';
    };

    const updateModalView = () => {
        quizModalEl.querySelectorAll('.question').forEach(el => el.style.display = 'none');
        let viewToShowId;
        switch (currentStep) {
            case steps.INFO:
                viewToShowId = 'question-1';
                break;
            case steps.QUESTIONS_LIST:
                viewToShowId = 'question-2';
                renderQuizQuestionsList();
                break;
            case steps.ADD_EDIT_QUESTION_FORM:
                viewToShowId = 'question-3';
                break;
            case steps.SETTINGS:
                viewToShowId = 'question-4';
                break;
        }
        const currentView = document.getElementById(viewToShowId);
        if (currentView) currentView.style.display = 'block';
        updateModalButtonsAndProgress();
    };

    const addAnswerOption = (option = { text: '', isCorrect: false }) => {
        const questionType = questionTypeSelect.value;
        const optionType = questionType === 'single-choice' ? 'radio' : 'checkbox';
        const uniqueId = `option-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const optionName = `is-correct-option-for-${currentEditingQuestionId || 'new-question'}`;
        const optionHtml = `<div class="d-flex align-items-center mb-2 quiz-option-row"><div class="flex-grow-1 me-2"><input type="text" class="form-control form-control-sm quiz-option-text" placeholder="Answer option text" value="${option.text}"></div><div class="form-check me-3"><input class="form-check-input quiz-option-iscorrect" type="${optionType}" name="${optionName}" id="${uniqueId}" ${option.isCorrect ? 'checked' : ''}><label class="form-check-label" for="${uniqueId}">Correct</label></div><button type="button" class="btn btn-sm btn-outline-danger remove-option-btn"><i class="feather-x" style="pointer-events: none;"></i></button></div>`;
        answerOptionsContainer.insertAdjacentHTML('beforeend', optionHtml);
    };

    const resetQuestionForm = () => {
        currentEditingQuestionId = null;
        questionTextInput.value = '';
        questionTypeSelect.value = 'single-choice';
        questionPointsInput.value = '10';
        answerOptionsContainer.innerHTML = '';
        const selectedType = questionTypeSelect.value;
        answerOptionsWrapper.style.display = (selectedType === 'single-choice' || selectedType === 'multiple-choice') ? 'block' : 'none';
    };

    const populateQuizSettingsForm = (quiz) => {
        if (!quiz) return;
        
        timeLimitValueInput.value = quiz.timeLimit?.value || 0;
        const timeUnit = quiz.timeLimit?.unit?.toLowerCase() || 'hours';
        if (timeUnit.startsWith('week')) timeLimitUnitSelect.value = 'Weaks';
        else if (timeUnit.startsWith('day')) timeLimitUnitSelect.value = 'Day';
        else timeLimitUnitSelect.value = 'Hour';
        
        hideTimeLimitCheckbox.checked = quiz.hideTimeLimit || false;
        
        const feedbackMode = quiz.feedbackMode || 'default';
        const radioIdMap = { 'default': 'rbt-radio1', 'reveal': 'rbt-radio2', 'retry': 'rbt-radio3' };
        const radioToCheck = settingsForm.querySelector(`#${radioIdMap[feedbackMode]}`);
        if(radioToCheck) radioToCheck.checked = true;

        passingGradeInput.value = quiz.passingGrade || 50;
        maxQuestionsInput.value = quiz.maxQuestionsAllowed || 10;
        autoStartCheckbox.checked = quiz.autoStart || false;
        if (questionLayoutSelect) questionLayoutSelect.value = quiz.questionLayout || 'single_question';
        if (questionOrderSelect) questionOrderSelect.value = quiz.questionOrder || 'Random';
        hideQuestionNumberCheckbox.checked = quiz.hideQuestionNumber || false;
        shortAnswerLimitInput.value = quiz.shortAnswerCharLimit || 200;
        essayLimitInput.value = quiz.essayCharLimit || 500;
    };

    const renderQuizQuestionsList = () => {
        if (!courseData || !currentEditingQuizId) {
            questionsListContainer.innerHTML = '<p>Save the quiz information first to add questions.</p>';
            return;
        }
        const episode = courseData.episodes.find(ep => ep._id == currentEditingEpisodeId);
        if (!episode || !episode.quizzes) return;
        const quiz = episode.quizzes.find(q => q._id == currentEditingQuizId);
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            questionsListContainer.innerHTML = '<p>No questions have been added to this quiz yet.</p>';
            return;
        }
        questionsListContainer.innerHTML = quiz.questions.map((q, i) => `<div class="d-flex justify-content-between align-items-center rbt-course-wrapper bg-color-white rbt-shadow-box mb-4"><div class="inner d-flex align-items-center gap-4"><h6 class="rbt-title mb-0"><strong>${i + 1}.</strong> ${q.questionText}</h6></div><div class="inner"><ul class="rbt-list-style-1 rbt-course-list d-flex gap-4"><li><a class="edit-question-btn" href="#" title="Edit" data-question-id="${q._id}"><i class="feather-edit"></i></a></li><li><a class="delete-question-btn" href="#" title="Delete" data-question-id="${q._id}"><i class="feather-trash"></i></a></li></ul></div></div>`).join('');
    };

    // --- 4. API CALLS & DATA HANDLING ---

    const saveQuizInfo = async () => {
        const selectedFeedbackRadio = Array.from(feedbackModeRadios).find(r => r.checked) || {};
        const feedbackModeMap = { 'rbt-radio1': 'default', 'rbt-radio2': 'reveal', 'rbt-radio3': 'retry' };

        let timeUnit = timeLimitUnitSelect.value;
        if (timeUnit === 'Weaks') timeUnit = 'Weeks';
        if (timeUnit === 'Day') timeUnit = 'Days';
        if (timeUnit === 'Hour') timeUnit = 'Hours';
        
        const settingsData = {
            timeLimit: {
                value: parseInt(timeLimitValueInput.value, 10),
                unit: timeUnit
            },
            hideTimeLimit: hideTimeLimitCheckbox.checked,
            feedbackMode: feedbackModeMap[selectedFeedbackRadio.id] || 'default',
            passingGrade: parseInt(passingGradeInput.value, 10),
            maxQuestionsAllowed: parseInt(maxQuestionsInput.value, 10),
            autoStart: autoStartCheckbox.checked,
            questionLayout: questionLayoutSelect?.value,
            questionOrder: questionOrderSelect?.value,
            hideQuestionNumber: hideQuestionNumberCheckbox.checked,
            shortAnswerCharLimit: parseInt(shortAnswerLimitInput.value, 10),
            essayCharLimit: parseInt(essayLimitInput.value, 10)
        };

        try {
            if (!currentEditingEpisodeId) throw new Error('No topic selected.');
            
            const quizData = {
                title: quizTitleInput.value,
                summary: quizSummaryInput.value,
                settings: settingsData
            };
            if (!quizData.title) throw new Error('Please enter a quiz title.');

            const courseId = new URLSearchParams(window.location.search).get('courseId');
            const isEditing = !!currentEditingQuizId;
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ?
                `${API_BASE_URL}/api/courses/${courseId}/episodes/${currentEditingEpisodeId}/quizzes/${currentEditingQuizId}` :
                `${API_BASE_URL}/api/courses/${courseId}/episodes/${currentEditingEpisodeId}/quizzes`;
            
            const bodyPayload = isEditing ? quizData : { title: quizData.title, summary: quizData.summary };

            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify(bodyPayload) });
            const result = await response.json();

            if (result.success) {
                courseData = result.course;
                if (!isEditing) {
                    const episode = courseData.episodes.find(ep => ep._id == currentEditingEpisodeId);
                    currentEditingQuizId = episode.quizzes[episode.quizzes.length - 1]._id;
                }
                return true;
            } else { throw new Error(result.message); }
        } catch (error) {
            alert(`Error saving quiz info: ${error.message}`);
            return false;
        }
    };

    const saveQuestion = async () => {
        saveQuestionBtn.disabled = true;
        const options = Array.from(answerOptionsContainer.querySelectorAll('.quiz-option-row')).map(row => ({
            text: row.querySelector('.quiz-option-text')?.value || '',
            isCorrect: row.querySelector('.quiz-option-iscorrect')?.checked || false
        }));
        const questionData = {
            questionText: questionTextInput.value,
            questionType: questionTypeSelect.value,
            points: questionPointsInput.value,
            options: (questionTypeSelect.value !== 'open-ended') ? options : []
        };
        if (!questionData.questionText) {
            alert('Please enter the question text.');
            saveQuestionBtn.disabled = false;
            return;
        }
        try {
            const courseId = new URLSearchParams(window.location.search).get('courseId');
            const isEditingQuestion = !!currentEditingQuestionId;
            const method = isEditingQuestion ? 'PUT' : 'POST';
            const url = isEditingQuestion ?
                `${API_BASE_URL}/api/courses/${courseId}/episodes/${currentEditingEpisodeId}/quizzes/${currentEditingQuizId}/questions/${currentEditingQuestionId}` :
                `${API_BASE_URL}/api/courses/${courseId}/episodes/${currentEditingEpisodeId}/quizzes/${currentEditingQuizId}/questions`;
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify(questionData) });
            const result = await response.json();
            if (result.success) {
                courseData = result.course;
                currentStep = steps.QUESTIONS_LIST;
                updateModalView();
            } else { throw new Error(result.message); }
        } catch (error) {
            alert(`An error occurred while saving the question: ${error.message}`);
        } finally {
            saveQuestionBtn.disabled = false;
        }
    };

    const deleteQuestion = async (questionId) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            const courseId = new URLSearchParams(window.location.search).get('courseId');
            const url = `${API_BASE_URL}/api/courses/${courseId}/episodes/${currentEditingEpisodeId}/quizzes/${currentEditingQuizId}/questions/${questionId}`;
            const response = await fetch(url, { method: 'DELETE', headers: { 'x-auth-token': token } });
            const result = await response.json();
            if (result.success) {
                courseData = result.course;
                renderQuizQuestionsList();
            } else { throw new Error(result.message); }
        } catch (error) {
            alert(`An error occurred while deleting the question: ${error.message}`);
        }
    };

    // --- 5. EVENT LISTENERS ---
    
    nextBtn.addEventListener('click', async () => {
        if (currentStep === steps.INFO) {
            nextBtn.disabled = true; nextBtn.innerHTML = 'Saving...';
            const success = await saveQuizInfo();
            nextBtn.disabled = false; nextBtn.innerHTML = 'Save & Next';
            if (success) { currentStep = steps.QUESTIONS_LIST; updateModalView(); }
        } else if (currentStep === steps.QUESTIONS_LIST) {
            currentStep = steps.SETTINGS; updateModalView();
        }
    });
    
    backBtn.addEventListener('click', () => {
        if (currentStep === steps.SETTINGS) currentStep = steps.QUESTIONS_LIST;
        else if (currentStep === steps.QUESTIONS_LIST) currentStep = steps.INFO;
        updateModalView();
    });

    finalSaveQuizBtn.addEventListener('click', async () => {
        finalSaveQuizBtn.disabled = true; finalSaveQuizBtn.textContent = 'Saving...';
        const success = await saveQuizInfo();
        finalSaveQuizBtn.disabled = false; finalSaveQuizBtn.textContent = 'Save Quiz';
        if (success) {
            if(typeof renderCourseBuilder === 'function') renderCourseBuilder(courseData.episodes);
            bootstrap.Modal.getInstance(quizModalEl).hide();
        }
    });
    
    addNewQuestionBtn.addEventListener('click', () => { resetQuestionForm(); currentStep = steps.ADD_EDIT_QUESTION_FORM; updateModalView(); });
    cancelQuestionBtn.addEventListener('click', () => { currentStep = steps.QUESTIONS_LIST; updateModalView(); });
    saveQuestionBtn.addEventListener('click', saveQuestion);
    addAnswerOptionBtn.addEventListener('click', () => addAnswerOption());
    answerOptionsContainer.addEventListener('click', (e) => { if (e.target.closest('.remove-option-btn')) { e.target.closest('.quiz-option-row').remove(); } });
    
    questionsListContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const editBtn = e.target.closest('.edit-question-btn');
        if (editBtn) {
            const questionId = editBtn.dataset.questionId;
            const episode = courseData.episodes.find(ep => ep._id == currentEditingEpisodeId);
            if (!episode) return;
            const quiz = episode.quizzes.find(q => q._id == currentEditingQuizId);
            if (!quiz) return;
            const question = quiz.questions.find(ques => ques._id == questionId);
            if (question) {
                currentEditingQuestionId = questionId;
                questionTextInput.value = question.questionText;
                questionTypeSelect.value = question.questionType;
                questionPointsInput.value = question.points;
                answerOptionsWrapper.style.display = (question.questionType !== 'open-ended') ? 'block' : 'none';
                answerOptionsContainer.innerHTML = '';
                if (question.options?.length > 0) {
                    question.options.forEach(opt => addAnswerOption(opt));
                }
                currentStep = steps.ADD_EDIT_QUESTION_FORM;
                updateModalView();
            }
        }
        const deleteBtn = e.target.closest('.delete-question-btn');
        if (deleteBtn) {
            deleteQuestion(deleteBtn.dataset.questionId);
        }
    });

    quizModalEl.addEventListener('hidden.bs.modal', () => {
        currentEditingEpisodeId = null;
        currentEditingQuizId = null;
        quizTitleInput.value = '';
        quizSummaryInput.value = '';
        questionsListContainer.innerHTML = '';
        resetQuestionForm();
        currentStep = steps.INFO;
        // Do not call updateModalView() here as it can cause issues on close
    });
    
    window.openUpdateQuizModal = function(episodeId, quizId) {
        currentEditingEpisodeId = episodeId;
        currentEditingQuizId = quizId;
        if (courseData) {
            const episode = courseData.episodes.find(ep => ep._id == episodeId);
            const quiz = episode?.quizzes.find(q => q._id == quizId);
            if (quiz) {
                quizTitleInput.value = quiz.title || '';
                quizSummaryInput.value = quiz.summary || '';
                populateQuizSettingsForm(quiz);
            }
        }
        currentStep = steps.INFO;
        updateModalView();
    };
    
    document.querySelector('.course-builder-wrapper')?.addEventListener('click', (e) => {
        const addQuizBtn = e.target.closest('.add-content-btn[data-bs-target="#Quiz"]');
        if (addQuizBtn) {
            currentEditingEpisodeId = addQuizBtn.dataset.episodeId;
            currentEditingQuizId = null;
            // Reset form fields for a new quiz
            quizTitleInput.value = '';
            quizSummaryInput.value = '';
            populateQuizSettingsForm({}); // Populate with defaults
            currentStep = steps.INFO;
            updateModalView();
        }
    });

})();
// --- Logic for custom file upload button ---
const triggerBtn = document.getElementById('triggerFileUploadBtn');
const fileInput = document.getElementById('lessonExerciseInput');
const fileListContainer = document.getElementById('exerciseFileListContainer');

if (triggerBtn && fileInput) {
    // When the visible button is clicked, trigger the hidden file input
    triggerBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // When files are selected, display their names
    fileInput.addEventListener('change', () => {
        if (fileListContainer) {
            fileListContainer.innerHTML = ''; // Clear previous list
            if (fileInput.files.length > 0) {
                let fileListHtml = '<p class="b3 mb-2">Selected Files:</p><ul class="list-group">';
                Array.from(fileInput.files).forEach(file => {
                    fileListHtml += `<li class="list-group-item list-group-item-sm">${file.name}</li>`;
                });
                fileListHtml += '</ul>';
                fileListContainer.innerHTML = fileListHtml;
            }
        }
    });
}


        // --- DEFINE ALL PAGE ELEMENTS ---
        const editCourseForm = document.getElementById('create-course-form');
        const courseTitleInput = document.getElementById('field-1');
        const slugInput = document.getElementById('field-2');
        const descriptionInput = document.getElementById('aboutCourse');
        const priceInput = document.getElementById('regularPrice-1');
        const discountedPriceInput = document.getElementById('discountedPrice-1');
        const videoUrlInput = document.getElementById('videoUrl');
        const thumbnailInput = document.getElementById('createinputfile');
        const thumbnailPreview = document.getElementById('createfileImage');
        const submitButton = document.getElementById('create-course-btn');
        const courseStatusSelect = document.getElementById('course-status');
        const previewButton = document.getElementById('preview-course-btn');
        const addTopicModal = document.getElementById('exampleModal');
        const updateTopicModal = document.getElementById('UpdateTopic');
        const saveTopicBtn = document.getElementById('save-topic-btn');
        const saveUpdateTopicBtn = document.getElementById('save-update-topic-btn');
        const lessonModal = document.getElementById('Lesson');
        const saveLessonBtn = document.getElementById('save-lesson-btn');
        

        if (submitButton) {
            const buttonText = submitButton.querySelector('.btn-text');
            if (buttonText) buttonText.textContent = 'Update Course';
        }
    // ADD THIS EVENT LISTENER FOR THE REMOVE BUTTON
    document.getElementById('remove-exercise-file-btn')?.addEventListener('click', () => {
        document.getElementById('current-exercise-file-container').style.display = 'none';
        document.getElementById('remove-exercise-file-flag').value = 'true';
        document.getElementById('lesson-exercise-file').value = '';
        document.getElementById('exercise-file-name').textContent = '';
    });
    // --- Display Names of Newly Selected Exercise Files ---
const lessonFileInput = document.getElementById('lesson-exercise-files');
if (lessonFileInput) {
    lessonFileInput.addEventListener('change', function() {
        const newFilesListContainer = document.getElementById('new-files-list');
        newFilesListContainer.innerHTML = ''; // Clear previous selection list

        if (this.files.length > 0) {
            let filesHtml = '<p class="b3 mb-2">Files to be uploaded:</p><ul class="list-group list-group-flush">';
            
            // Loop through the FileList and create a list item for each file
            Array.from(this.files).forEach(file => {
                filesHtml += `<li class="list-group-item list-group-item-action">${file.name}</li>`;
            });

            filesHtml += '</ul>';
            newFilesListContainer.innerHTML = filesHtml;
        }
    });
}
        // --- FETCH AND POPULATE ALL DATA ON PAGE LOAD ---
fetch(`${API_BASE_URL}/api/courses/edit/${courseId}`, { headers: { 'x-auth-token': token } })
    .then(res => res.ok ? res.json() : Promise.reject('Course not found'))
    .then(result => {
        if (result.success) {
            const course = result.course;
            courseData = course;
            
            console.log('Loading course data from server:', {
                whatYoullLearn: course.whatYoullLearn,
                tags: course.tags,
                duration: course.duration,
                requirements: course.requirements
            });

            // Basic fields
            if (courseTitleInput) courseTitleInput.value = course.title || '';
            if (slugInput) slugInput.value = course.slug || '';
            if (descriptionInput) course.description ? descriptionInput.value = course.description : '';
            if (priceInput) course.originalPrice ? priceInput.value = course.originalPrice : '';
            if (discountedPriceInput) course.price ? discountedPriceInput.value = course.price : '';
            if (videoUrlInput) videoUrlInput.value = course.previewVideoUrl || '';
            if (thumbnailPreview && course.thumbnail) thumbnailPreview.src = `/${course.thumbnail}`;
            if (courseStatusSelect) courseStatusSelect.value = course.status || 'Draft';
            
            // Additional Information fields - FIXED
            if (course.startDate) {
                try {
                    const date = new Date(course.startDate);
                    if (!isNaN(date)) {
                        document.getElementById('startDate').value = date.toISOString().split('T')[0];
                    }
                } catch (e) {
                    console.error('Error parsing startDate:', e);
                }
            }
            
            // Language - handle both array and string
            if (course.language && course.language.length > 0) {
                const languageSelect = document.getElementById('language');
                if (languageSelect) {
                    Array.from(languageSelect.options).forEach(option => {
                        option.selected = course.language.includes(option.value);
                    });
                }
            }
            
            // Get all HTML elements
            const whatLearnElement = document.getElementById('whatLearn');
            const descriptionElement = document.getElementById('description');
            const durationHoursElement = document.getElementById('totalDurationHours');
            const durationMinutesElement = document.getElementById('totalDurationMinutes');
            const courseTagElement = document.getElementById('courseTag');
            const targetedElement = document.getElementById('targeted');
            
            console.log('HTML elements status:', {
                whatLearn: !!whatLearnElement,
                description: !!descriptionElement,
                durationHours: !!durationHoursElement,
                durationMinutes: !!durationMinutesElement,
                courseTag: !!courseTagElement,
                targeted: !!targetedElement
            });
            
            // Populate fields - with null checks and fallbacks
            if (whatLearnElement) {
                whatLearnElement.value = course.requirements ? 
                    (Array.isArray(course.requirements) ? course.requirements.join('\n') : course.requirements) : '';
                console.log('Set requirements to:', whatLearnElement.value);
            }
            
            if (descriptionElement) {
                descriptionElement.value = course.whatYoullLearn ? 
                    (Array.isArray(course.whatYoullLearn) ? course.whatYoullLearn.join('\n') : course.whatYoullLearn) : '';
                console.log('Set whatYoullLearn to:', descriptionElement.value);
            }
            
            if (durationHoursElement) {
                durationHoursElement.value = course.duration && course.duration.hours ? course.duration.hours : 0;
                console.log('Set duration hours to:', durationHoursElement.value);
            }
            
            if (durationMinutesElement) {
                durationMinutesElement.value = course.duration && course.duration.minutes ? course.duration.minutes : 0;
                console.log('Set duration minutes to:', durationMinutesElement.value);
            }
            
            if (courseTagElement) {
                courseTagElement.value = course.tags ? 
                    (Array.isArray(course.tags) ? course.tags.join(', ') : course.tags) : '';
                console.log('Set tags to:', courseTagElement.value);
            }
            
            if (targetedElement) {
                targetedElement.value = course.targetedAudience ? 
                    (Array.isArray(course.targetedAudience) ? course.targetedAudience.join('\n') : course.targetedAudience) : '';
                console.log('Set targetedAudience to:', targetedElement.value);
            }
            
            // Certificate template
            if (course.certificateTemplate && course.certificateTemplate !== 'none') {
                const selectedRadio = document.querySelector(`input[value="${course.certificateTemplate}"]`);
                if (selectedRadio) {
                    selectedRadio.checked = true;
                    console.log('Set certificate template to:', course.certificateTemplate);
                }
                
                if (course.certificateOrientation === 'portrait') {
                    const portraitTab = document.getElementById('portrait-tab');
                    if (portraitTab) {
                        portraitTab.click();
                        console.log('Set orientation to portrait');
                    }
                }
                
            }
            // --- ADD THIS NEW BLOCK ---
if (masterclassSwitch) {
    // 1. Set the switch's state from the database value
    masterclassSwitch.checked = course.isMasterclass || false;
    
    // 2. Update the preview button link based on the initial state
    updatePreviewButton(course.isMasterclass); 

    // 3. Add a listener to update the preview link whenever the switch is toggled
    masterclassSwitch.addEventListener('change', () => {
        updatePreviewButton(masterclassSwitch.checked);
    });
}
// --- END OF NEW BLOCK ---
            renderCourseBuilder(course.episodes);
        }
    })
    .catch(error => {
        console.error('Error loading course:', error);
        alert(`Error loading course data.`);
        window.location.href = 'instructor-course.html';
    });

        // --- EVENT LISTENERS ---
// Replace your old previewButton listener with this one
if (previewButton) {
    previewButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Get the link from our dynamically set attribute
        const destination = previewButton.getAttribute('data-href');
        if (destination) {
            window.open(destination, '_blank');
        }
    });
}

// Lesson Modal Setup
// --- CORRECTED: Lesson Modal Setup Listener ---
if (lessonModal) {
    lessonModal.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget; // This is the button that triggered the modal

        // Check if the modal was opened by an "Add" button (which has the new class)
        // This condition is true for "Add Lesson" but false for "Edit Lesson"
        if (button && button.classList.contains('add-content-btn')) {

            currentEditingEpisodeId = button.dataset.episodeId;
            currentEditingLessonId = null; // Crucial: ensure we are in "Add" mode

            // 1. Reset the form to its empty state
            document.getElementById('lesson-form').reset();

            // 2. Reset modal title and button text
            lessonModal.querySelector('.modal-title').textContent = 'Add Lesson';
            const saveBtn = lessonModal.querySelector('#save-lesson-btn');
            saveBtn.innerHTML = `
                <span class="icon-reverse-wrapper">
                    <span class="btn-text">Add Lesson</span>
                    <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                    <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                </span>
            `;

            // 3. Clear any file lists from a previous edit session
            document.getElementById('existing-exercise-files').innerHTML = '';
            document.getElementById('new-files-list').innerHTML = '';
        }
    });
}
        // Save Lesson Button
if (saveLessonBtn) {
    saveLessonBtn.addEventListener('click', async () => {
        const title = document.getElementById('lesson-title').value;
        const summary = document.getElementById('lesson-summary').value;
        const videoSource = document.getElementById('lesson-video-source').value;
        const vimeoUrl = videoSource === 'Vimeo' ? document.getElementById('lesson-video-url').value : '';
        const hr = document.getElementById('lesson-duration-hr').value || '0';
        const min = document.getElementById('lesson-duration-min').value || '0';
        const sec = document.getElementById('lesson-duration-sec').value || '0';
        const duration = `${hr} hr ${min} min ${sec} sec`;
        const isPreview = document.getElementById('lesson-is-preview').checked;
        
        // --- THIS IS THE CORRECTED LINE ---
        const exerciseFileInput = document.getElementById('lesson-exercise-files'); 
        
        const episodeId = currentEditingEpisodeId;

        if (!title) return alert('Please enter a lesson title.');
        if (!episodeId) return alert('No episode selected. Please try again.');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('summary', summary);
            formData.append('vimeoUrl', vimeoUrl);
            formData.append('duration', duration);
            formData.append('isPreview', isPreview);

            if (exerciseFileInput && exerciseFileInput.files.length > 0) {
                for (const file of exerciseFileInput.files) {
                    formData.append('exerciseFiles', file);
                }
            }

            const url = currentEditingLessonId 
                ? `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons/${currentEditingLessonId}`
                : `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons`;
            const method = currentEditingLessonId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'x-auth-token': token },
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                courseData = result.course;
                renderCourseBuilder(courseData.episodes);
                bootstrap.Modal.getInstance(lessonModal).hide();
                lessonModal.querySelector('form')?.reset();
                if (exerciseFileInput) exerciseFileInput.value = '';
                lessonModal.querySelector('.modal-title').textContent = 'Add Lesson';
                lessonModal.querySelector('#save-lesson-btn').innerHTML = `
                    <span class="icon-reverse-wrapper">
                        <span class="btn-text">Add Lesson</span>
                        <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                        <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                    </span>
                `;
                currentEditingLessonId = null;
                currentEditingEpisodeId = null;
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('An error occurred while saving the lesson.');
        }
    });
}

        // Delete Lesson Event Listener
        document.addEventListener('click', async (e) => {
            const deleteLessonBtn = e.target.closest('.delete-lesson');
            if (deleteLessonBtn) {
                if (confirm('Are you sure you want to delete this lesson?')) {
                    const episodeId = deleteLessonBtn.dataset.episodeId;
                    const lessonId = deleteLessonBtn.dataset.lessonId;
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons/${lessonId}`, {
                            method: 'DELETE',
                            headers: { 'x-auth-token': token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            courseData = result.course;
                            renderCourseBuilder(courseData.episodes);
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Error deleting lesson:', error);
                        alert('An error occurred while deleting the lesson.');
                    }
                }
            }
        });
        // --- NEW: Remove Exercise File Event Listener ---
document.addEventListener('click', async (e) => {
    const removeBtn = e.target.closest('.remove-existing-file-btn');
    if (removeBtn) {
        e.preventDefault(); // Prevent any default button action

        if (confirm('Are you sure you want to remove this file?')) {
            const { courseId, episodeId, lessonId, filePath } = removeBtn.dataset;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons/${lessonId}/files`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ filePath: filePath }) // Send the file path to identify which file to delete
                });

                const result = await response.json();

                if (result.success) {
                    // Update global data and re-render the main list
                    courseData = result.course;
                    renderCourseBuilder(courseData.episodes);
                    
                    // Visually remove the file from the modal list immediately
                    removeBtn.closest('li').remove(); 
                    
                    // Optional: If the list is now empty, remove the "Attached Files" heading
                    const fileList = removeBtn.closest('ul');
                    if (fileList && fileList.children.length === 0) {
                        fileList.previousElementSibling.remove(); // Removes the <p> heading
                        fileList.remove();
                    }
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error removing exercise file:', error);
                alert('An error occurred while removing the file.');
            }
        }
    }
});
// --- CORRECTED: Generic Edit Item Event Listener ---
document.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-item'); 
    if (editBtn) {
        const { episodeId, itemId, itemType } = editBtn.dataset; 

        if (itemType === 'lesson') {
            openUpdateLessonModal(episodeId, itemId); 
            const lessonModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('Lesson'));
            lessonModalInstance.show();
        } 
        else if (itemType === 'quiz') {
            openUpdateQuizModal(episodeId, itemId);

            // This resets the quiz modal to step 1 when editing
            const quizNav = document.querySelector('#Quiz .quiz-modal-btn');
            if (quizNav) quizNav.dispatchEvent(new Event('reset'));

            const quizModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('Quiz'));
            quizModalInstance.show();
        }
    }
});
// Add this event listener for lesson clicks
document.addEventListener('click', function(e) {
    const lessonLink = e.target.closest('.lesson-link');
    if (lessonLink) {
        e.preventDefault();
        
        const courseId = new URLSearchParams(window.location.search).get('courseId');
        const episodeId = lessonLink.dataset.episodeId;
        const lessonId = lessonLink.dataset.lessonId;
        const lessonTitle = lessonLink.dataset.title;
        const lessonSummary = lessonLink.dataset.summary;
        const vimeoUrl = lessonLink.dataset.vimeoUrl;
        
        // Store lesson data for lesson.html
        localStorage.setItem('currentLesson', JSON.stringify({
            courseId,
            episodeId,
            lessonId,
            title: lessonTitle,
            summary: lessonSummary,
            vimeoUrl: vimeoUrl
        }));
        
        // Navigate to lesson page
        window.location.href = `lesson.html?courseId=${courseId}&episodeId=${episodeId}&lessonId=${lessonId}`;
    }
});
        // "Add Topic" Modal Save Button
        if (saveTopicBtn) {
            saveTopicBtn.addEventListener('click', async () => {
                const title = document.getElementById('add-topic-title').value;
                const summary = document.getElementById('add-topic-summary').value;
                if (!title) { return alert('Please enter a topic name.'); }

                try {
                    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                        body: JSON.stringify({ title, summary }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        courseData = result.course;
                        renderCourseBuilder(courseData.episodes);
                        bootstrap.Modal.getInstance(addTopicModal).hide();
                        document.getElementById('add-topic-title').value = '';
                        document.getElementById('add-topic-summary').value = '';
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    alert('An error occurred while saving the topic.');
                }
            });
        }

        // Delete Topic Event Listener
        document.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.rbt-course-del');
            if (deleteBtn) {
                if (confirm('Are you sure you want to delete this topic?')) {
                    const episodeId = deleteBtn.dataset.episodeId;
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}`, {
                            method: 'DELETE',
                            headers: { 'x-auth-token': token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            courseData = result.course;
                            renderCourseBuilder(courseData.episodes);
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Error deleting topic:', error);
                        alert('An error occurred while deleting the topic.');
                    }
                }
            }
        });

        // Update Topic Save Button
        if (saveUpdateTopicBtn) {
            saveUpdateTopicBtn.addEventListener('click', async () => {
                const episodeId = currentEditingEpisodeId;
                if (!episodeId) return alert('No topic selected for editing.');
                const title = document.getElementById('update-topic-title').value;
                const summary = document.getElementById('update-topic-summary').value;
                try {
                    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                        body: JSON.stringify({ title, summary })
                    });
                    const result = await response.json();
                    if (result.success) {
                        courseData = result.course;
                        renderCourseBuilder(courseData.episodes);
                        bootstrap.Modal.getInstance(updateTopicModal).hide();
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error updating topic:', error);
                    alert('An error occurred while updating the topic.');
                }
            });
        }

        // Main "Update Course" Form
if (editCourseForm) {
    editCourseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Basic fields
        formData.append('title', document.getElementById('field-1').value);
        formData.append('slug', document.getElementById('field-2').value);
        formData.append('description', document.getElementById('aboutCourse').value);
        formData.append('originalPrice', document.getElementById('regularPrice-1').value);
        formData.append('price', document.getElementById('discountedPrice-1').value);
        formData.append('previewVideoUrl', document.getElementById('videoUrl').value);
        formData.append('status', document.getElementById('course-status').value);
        
        // Additional Information fields - CORRECTED FIELD NAMES
        formData.append('startDate', document.getElementById('startDate')?.value || '');
        
        // Language
        const languageSelect = document.getElementById('language');
        if (languageSelect) {
            const selectedLanguages = Array.from(languageSelect.selectedOptions).map(opt => opt.value);
            formData.append('language', JSON.stringify(selectedLanguages));
        }
        
        // Use the correct field names that match your model:
        formData.append('requirements', document.getElementById('whatLearn')?.value || '');
        formData.append('whatYoullLearn', document.getElementById('description')?.value || ''); // This matches your model
        formData.append('durationHours', document.getElementById('totalDurationHours')?.value || '0');
        formData.append('durationMinutes', document.getElementById('totalDurationMinutes')?.value || '0');
        formData.append('tags', document.getElementById('courseTag')?.value || ''); // This matches your model
        formData.append('targetedAudience', document.getElementById('targeted')?.value || '');
        
        // Certificate fields
        const selectedTemplate = document.querySelector('input[name="radio-group"]:checked') || 
                               document.querySelector('input[name="radio-group-portrait"]:checked');
        if (selectedTemplate) {
            formData.append('certificateTemplate', selectedTemplate.value);
        }
        
        const activeTab = document.querySelector('.advance-tab-button a.active');
        if (activeTab) {
            const orientation = activeTab.id === 'landscape-tab' ? 'landscape' : 'portrait';
            formData.append('certificateOrientation', orientation);
        }
        
        if (thumbnailInput.files.length > 0) {
            formData.append('thumbnail', thumbnailInput.files[0]);
        }

        // Debug log
        console.log('FormData being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token },
                body: formData,
            });
            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                alert('Course updated successfully!');
                window.location.href = '/instructor-course.html';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('An error occurred while updating the course.');
        }
    });
}
    }; // End of window.onload
}