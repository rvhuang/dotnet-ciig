"use strict";
// Author: Robert Vandenberg Huang
// rvh.omni@gmail.com
var InterfaceInfo = /** @class */ (function () {
    function InterfaceInfo(typeName, ns, referenceUrl) {
        this._typeName = typeName;
        this._namespace = ns;
        this._referenceUrl = referenceUrl;
    }
    Object.defineProperty(InterfaceInfo.prototype, "typeName", {
        get: function () {
            return this._typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterfaceInfo.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterfaceInfo.prototype, "referenceUrl", {
        get: function () {
            return InterfaceInfo.baseReferenceUrl + this._referenceUrl;
        },
        enumerable: true,
        configurable: true
    });
    InterfaceInfo.createAllInterfaces = function () {
        var interfaces = new Array();
        interfaces.push(new InterfaceInfo("IEnumerable<T>", "System.Collections.Generic", "system.collections.generic.ienumerable-1"));
        interfaces.push(new InterfaceInfo("IProducerConsumerCollection<T>", "System.Collections.Concurrent", "system.collections.concurrent.iproducerconsumercollection-1"));
        interfaces.push(new InterfaceInfo("IReadOnlyCollection<T>", "System.Collections.Generic", "system.collections.generic.ireadonlycollection-1"));
        interfaces.push(new InterfaceInfo("IReadOnlyList<T>", "System.Collections.Generic", "system.collections.generic.ireadonlylist-1"));
        interfaces.push(new InterfaceInfo("IReadOnlyDictionary<TKey, TValue>", "System.Collections.Generic", "system.collections.generic.ireadonlydictionary-2"));
        interfaces.push(new InterfaceInfo("ICollection<T>", "System.Collections.Generic", "system.collections.generic.icollection-1"));
        interfaces.push(new InterfaceInfo("IList<T>", "System.Collections.Generic", "system.collections.generic.ilist-1"));
        interfaces.push(new InterfaceInfo("ISet<T>", "System.Collections.Generic", "system.collections.generic.iset-1"));
        interfaces.push(new InterfaceInfo("IDictionary<TKey, TValue>", "System.Collections.Generic", "system.collections.generic.idictionary-2"));
        interfaces.push(new InterfaceInfo("IEnumerable<IGrouping<TKey, TElement>>", "System.Linq", "system.linq.igrouping-2"));
        interfaces.push(new InterfaceInfo("ILookup<TKey, TElement>", "System.Linq", "system.linq.ilookup-2"));
        interfaces.push(new InterfaceInfo("IOrderedEnumerable<TElement>", "System.Linq", "system.linq.iorderedenumerable-1"));
        interfaces.push(new InterfaceInfo("IQueryable<T>", "System.Linq", "system.linq.iqueryable-1"));
        interfaces.push(new InterfaceInfo("IOrderedQueryable<T>", "System.Linq", "system.linq.iorderedqueryable-1"));
        return interfaces;
    };
    InterfaceInfo.baseReferenceUrl = "https://docs.microsoft.com/en-us/dotnet/api/";
    return InterfaceInfo;
}());
var QuestionType;
(function (QuestionType) {
    QuestionType[QuestionType["Questionnaire"] = 0] = "Questionnaire";
    QuestionType[QuestionType["CheckListItem"] = 1] = "CheckListItem";
})(QuestionType || (QuestionType = {}));
var Question = /** @class */ (function () {
    function Question(question) {
        this._interfaces = question.interfaces;
        this._yourAnswer = false;
        this.text = question.text;
        this.answer = question.answer;
        this.description = question.description;
        this.questionType = question.questionType;
    }
    Object.defineProperty(Question.prototype, "yourAnswer", {
        get: function () {
            return this._yourAnswer;
        },
        set: function (value) {
            this._yourAnswer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "interfaces", {
        get: function () {
            return this._interfaces;
        },
        set: function (interfaces) {
            this._interfaces = interfaces == null ? new Array() : interfaces;
        },
        enumerable: true,
        configurable: true
    });
    Question.compare = function (a, b) {
        if (a == null && b != null)
            return 1;
        if (a != null && b == null)
            return -1;
        if (a == null && b == null)
            return 0;
        if (a.interfaces.length < b.interfaces.length)
            return -1;
        if (a.interfaces.length > b.interfaces.length)
            return 1;
        return 0;
    };
    return Question;
}());
var Flow = /** @class */ (function () {
    function Flow(questions, interfaces) {
        this._questions = questions.sort(Question.compare);
        this._currentQuestion = null;
        this._doneQuestions = new Array();
        this._skippedQuestions = new Array();
        this._interfaces = interfaces;
        console.log("Remaining interfaces:");
        console.log(this._interfaces.map(function (i) { return i.typeName; }));
    }
    Object.defineProperty(Flow.prototype, "hasNextQuestion", {
        get: function () {
            return this._questions.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "currentQuestion", {
        get: function () {
            return this._currentQuestion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "answeredQuestions", {
        get: function () {
            return this._doneQuestions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "skippedQuestions", {
        get: function () {
            return this._skippedQuestions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "allQuestionTexts", {
        get: function () {
            return this._questions.map(function (q) { return q.text; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "interfaces", {
        get: function () {
            return this._interfaces;
        },
        enumerable: true,
        configurable: true
    });
    Flow.prototype.moveToNextQuestion = function () {
        var index = Math.floor(Math.random() * (this._questions.length - 0)) + 0;
        if (this._currentQuestion == null || this._questions.length > 0) {
            this._currentQuestion = this._questions[index];
            this._questions.splice(index, 1);
        }
        else {
            this._currentQuestion = null;
        }
        return this._currentQuestion;
    };
    Flow.prototype.answerCurrentQuestion = function (answer) {
        var _this = this;
        if (this._currentQuestion == null)
            return;
        if (this._doneQuestions.length > 0 && this._doneQuestions[this._doneQuestions.length - 1].text == this._currentQuestion.text)
            return;
        if (this._currentQuestion.answer == answer) {
            this._interfaces = this._interfaces.filter(function (i) { return _this._currentQuestion.interfaces.indexOf(i.typeName) >= 0; });
        }
        else {
            this._interfaces = this._interfaces.filter(function (i) { return _this._currentQuestion.interfaces.indexOf(i.typeName) < 0; });
        }
        this._currentQuestion.yourAnswer = answer;
        this._questions = this._questions.filter(function (q) { return _this.questionFilter(q, _this._interfaces.map(function (i) { return i.typeName; })); }).sort(Question.compare);
        this._doneQuestions.push(this._currentQuestion);
    };
    Flow.prototype.getInterfaceInfo = function (typeName) {
        return this._interfaces.filter(function (i) { return i.typeName == typeName; })[0];
    };
    Flow.prototype.questionFilter = function (q, interfaceTypes) {
        /* We need to eliminate two kinds of questions:
         * 1. Questions that are no longer relevant.
         * 2. Questions that could remove all remaining interfaces.
         */
        if (q.interfaces.every(function (typeName) { return interfaceTypes.indexOf(typeName) < 0; }))
            return false;
        if (q.interfaces.length < interfaceTypes.length)
            return true;
        if (interfaceTypes.some(function (typeName) { return q.interfaces.indexOf(typeName) < 0; }))
            return true;
        this._skippedQuestions.push(q);
        return false;
    };
    Flow.initialize = function (questions) {
        return new Flow(questions.filter(function (q) { return q.questionType == QuestionType.Questionnaire; }).map(function (q) { return new Question(q); }), InterfaceInfo.createAllInterfaces());
    };
    return Flow;
}());
var CheckList = /** @class */ (function () {
    function CheckList(questions, interfaces) {
        this._questions = questions.sort(Question.compare);
        this._questions.forEach(function (q) { return q.yourAnswer = false; });
        this._interfaces = interfaces;
        this._interfaces.sort(function (a, b) { return a.typeName.localeCompare(b.typeName); });
        this._ticked = new Array();
    }
    Object.defineProperty(CheckList.prototype, "allQuestionTexts", {
        get: function () {
            return this._questions.map(function (q) { return q.text; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckList.prototype, "interfaces", {
        get: function () {
            return this._interfaces;
        },
        enumerable: true,
        configurable: true
    });
    CheckList.prototype.tickQuestion = function (questionText) {
        var _this = this;
        this._questions.filter(function (q) { return q.text == questionText; }).forEach(function (q) { return q.yourAnswer = !q.yourAnswer; });
        this._ticked = this._questions.filter(function (q) { return q.yourAnswer == q.answer; });
        this._interfaces.sort(function (a, b) {
            if (_this._ticked.length > 0) {
                var checkStateA = _this._ticked.every(function (q) { return q.interfaces.indexOf(a.typeName) >= 0; });
                var checkStateB = _this._ticked.every(function (q) { return q.interfaces.indexOf(b.typeName) >= 0; });
                if (checkStateA && !checkStateB)
                    return -1;
                if (checkStateB && !checkStateA)
                    return 1;
            }
            return a.typeName.localeCompare(b.typeName);
        });
    };
    CheckList.prototype.checkInterfaceAvailability = function (typeName) {
        return this._ticked != null && this._ticked.length > 0 && this._ticked.every(function (q) { return q.interfaces.indexOf(typeName) >= 0; });
    };
    CheckList.initialize = function (questions) {
        return new CheckList(questions.filter(function (q) { return q.questionType == QuestionType.CheckListItem; }).map(function (q) { return new Question(q); }), InterfaceInfo.createAllInterfaces());
    };
    return CheckList;
}());
