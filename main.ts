// Author: Robert Vandenberg Huang
// rvh.omni@gmail.com

class InterfaceInfo {
    public static readonly baseReferenceUrl: string = "https://docs.microsoft.com/en-us/dotnet/api/";

    private _typeName: string;
    private _namespace: string;
    private _referenceUrl: string;
    private _shortName: string;
    
    get typeName(): string {
        return this._typeName;
    }    
    get namespace(): string {
        return this._namespace;
    }
    get referenceUrl(): string {
        return InterfaceInfo.baseReferenceUrl + this._referenceUrl;
    }
    get shortName(): string {
        return this._shortName;
    }

    constructor(typeName: string, ns: string, referenceUrl: string, shortName: string) { 
        this._typeName = typeName;
        this._namespace = ns;
        this._referenceUrl = referenceUrl;
        this._shortName = shortName;
    }

    static createAllInterfaces(): Array<InterfaceInfo> {
        var interfaces = new Array<InterfaceInfo>();

        interfaces.push(new InterfaceInfo("IEnumerable<T>", "System.Collections.Generic", "system.collections.generic.ienumerable-1", "E"));
        interfaces.push(new InterfaceInfo("IProducerConsumerCollection<T>", "System.Collections.Concurrent", "system.collections.concurrent.iproducerconsumercollection-1", "PCC"));
        interfaces.push(new InterfaceInfo("IReadOnlyCollection<T>", "System.Collections.Generic", "system.collections.generic.ireadonlycollection-1", "ROC"));
        interfaces.push(new InterfaceInfo("IReadOnlyList<T>", "System.Collections.Generic", "system.collections.generic.ireadonlylist-1", "ROL"));
        interfaces.push(new InterfaceInfo("IReadOnlyDictionary<TKey, TValue>", "System.Collections.Generic", "system.collections.generic.ireadonlydictionary-2", "ROD"));
        interfaces.push(new InterfaceInfo("ICollection<T>", "System.Collections.Generic", "system.collections.generic.icollection-1", "C"));
        interfaces.push(new InterfaceInfo("IList<T>", "System.Collections.Generic", "system.collections.generic.ilist-1", "L"));
        interfaces.push(new InterfaceInfo("ISet<T>", "System.Collections.Generic", "system.collections.generic.iset-1", "S"));
        interfaces.push(new InterfaceInfo("IDictionary<TKey, TValue>", "System.Collections.Generic", "system.collections.generic.idictionary-2", "D"));

        interfaces.push(new InterfaceInfo("IEnumerable<IGrouping<TKey, TElement>>", "System.Linq", "system.linq.igrouping-2", "G"));
        interfaces.push(new InterfaceInfo("ILookup<TKey, TElement>", "System.Linq", "system.linq.ilookup-2", "Lkp"));
        interfaces.push(new InterfaceInfo("IOrderedEnumerable<TElement>", "System.Linq", "system.linq.iorderedenumerable-1", "OE"));
        interfaces.push(new InterfaceInfo("IQueryable<T>", "System.Linq", "system.linq.iqueryable-1", "Q"));
        interfaces.push(new InterfaceInfo("IOrderedQueryable<T>", "System.Linq", "system.linq.iorderedqueryable-1", "OQ"));

        return interfaces;
    }
}

enum QuestionType {
    Questionnaire,
    CheckListItem
}

interface QuestionInfo {
    readonly interfaces: Array<string>;
    readonly text: string;
    readonly answer: boolean;
    readonly description: string;
    readonly questionType: QuestionType;
}

class Question implements QuestionInfo {
    private _interfaces: Array<string>;  
    private _yourAnswer: boolean;

    public readonly text: string;    
    /**
     * true: yes
     * false: no
     */
    public readonly answer: boolean;
    public readonly description: string;
    public readonly questionType: QuestionType;
  
    public get yourAnswer(): boolean{
        return this._yourAnswer;
    }
    public set yourAnswer(value: boolean) {
        this._yourAnswer = value;
    }

    public get interfaces(): Array<string> {
        return this._interfaces;
    }
    public set interfaces(interfaces: Array<string>){
        this._interfaces = interfaces == null ? new Array<string>() : interfaces;
    }
    
    constructor(question: QuestionInfo) {
        this._interfaces = question.interfaces;
        this._yourAnswer = false;

        this.text = question.text;
        this.answer = question.answer;
        this.description = question.description;
        this.questionType = question.questionType;
    }

    static compare(a: Question, b: Question): number {
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
    }
}

class Flow {
    private _questions: Array<Question>;
    private _doneQuestions: Array<Question>; 
    private _skippedQuestions: Array<Question>; 
    private _interfaces: Array<InterfaceInfo>;

    private _currentQuestion: Question | null;

    get hasNextQuestion(): boolean {
        return this._questions.length > 0;
    }

    get currentQuestion(): Question | null {
        return this._currentQuestion;
    }

    get answeredQuestions(): Array<Question> {
        return this._doneQuestions;
    }

    get skippedQuestions(): Array<Question> { 
        return this._skippedQuestions;
    }

    get allQuestionTexts(): Array<string> {
        return this._questions.map(q => q.text);
    }

    get interfaces(): Array<InterfaceInfo> {
        return this._interfaces;
    }

    moveToNextQuestion() : Question | null {        
        var index = Math.floor(Math.random() * (this._questions.length  - 0)) + 0;
        
        if (this._currentQuestion == null || this._questions.length > 0) {
            this._currentQuestion = this._questions[index];
            this._questions.splice(index, 1); 
        }
        else { 
            this._currentQuestion = null;
        }
        return this._currentQuestion;
    }

    answerCurrentQuestion(answer: boolean): void {
        if (this._currentQuestion == null) return;
        if (this._doneQuestions.length > 0 && this._doneQuestions[this._doneQuestions.length - 1].text == this._currentQuestion.text)
            return;
        
        if (this._currentQuestion.answer == answer) {
            this._interfaces = this._interfaces.filter(i => this._currentQuestion!.interfaces.indexOf(i.typeName) >= 0);
        }
        else {
            this._interfaces = this._interfaces.filter(i => this._currentQuestion!.interfaces.indexOf(i.typeName) < 0);
        }
        this._currentQuestion.yourAnswer = answer;
        this._questions = this._questions.filter(q => this.questionFilter(q, this._interfaces.map(i => i.typeName))).sort(Question.compare);
        this._doneQuestions.push(this._currentQuestion);
    }

    getInterfaceInfo(typeName: string) : InterfaceInfo {
        return this._interfaces.filter(i => i.typeName == typeName)[0];
    }

    private questionFilter(q : Question, interfaceTypes: Array<string>) : boolean {
        /* We need to eliminate two kinds of questions:
         * 1. Questions that are no longer relevant.
         * 2. Questions that could remove all remaining interfaces. 
         */

        if (q.interfaces.every(typeName => interfaceTypes.indexOf(typeName) < 0))
            return false;

        if (q.interfaces.length < interfaceTypes.length)   
            return true; 
        
        if (interfaceTypes.some(typeName => q.interfaces.indexOf(typeName) < 0))
            return true;
        
        this._skippedQuestions.push(q);
        return false;
    }

    constructor(questions: Array<Question>, interfaces: Array<InterfaceInfo>) {
        this._questions = questions.sort(Question.compare);
        this._currentQuestion = null;
        this._doneQuestions = new Array<Question>();
        this._skippedQuestions = new Array<Question>();
        this._interfaces = interfaces;  
        
        console.log("Remaining interfaces:");
        console.log(this._interfaces.map(i => i.typeName));      
    }

    static initialize(questions: Array<QuestionInfo>): Flow {
        return new Flow(questions.filter(q => q.questionType == QuestionType.Questionnaire).map(q => new Question(q)), InterfaceInfo.createAllInterfaces());
    }
}

class CheckList {
    private _questions: Array<Question>;
    private _ticked: ReadonlyArray<Question>;
    private _interfaces: Array<InterfaceInfo>;
    
    get allQuestionTexts(): Array<string> {
        return this._questions.map(q => q.text);
    }

    get interfaces(): Array<InterfaceInfo> {
        return this._interfaces;
    }

    tickQuestion(questionText: string){
        this._questions.filter(q => q.text == questionText).forEach(q => q.yourAnswer = !q.yourAnswer);
        this._ticked = this._questions.filter(q => q.yourAnswer == q.answer);
        this._interfaces.sort((a, b) => {
            if (this._ticked.length > 0) {
                var checkStateA = this._ticked.every(q => q.interfaces.indexOf(a.typeName) >= 0);
                var checkStateB = this._ticked.every(q => q.interfaces.indexOf(b.typeName) >= 0);

                if (checkStateA && !checkStateB) return -1;
                if (checkStateB && !checkStateA) return 1;
            }
            return a.typeName.localeCompare(b.typeName);
        });
    }

    checkInterfaceAvailability(typeName: string) : boolean {
        return this._ticked != null && this._ticked.length > 0 && this._ticked.every(q => q.interfaces.indexOf(typeName) >= 0);
    }

    constructor(questions: Array<Question>, interfaces: Array<InterfaceInfo>) {
        this._questions = questions.sort(Question.compare);
        this._questions.forEach(q => q.yourAnswer = false);
        this._interfaces = interfaces;
        this._interfaces.sort((a, b) => a.typeName.localeCompare(b.typeName));  
        this._ticked = new Array<Question>();
    }

    static initialize(questions: Array<QuestionInfo>): CheckList {
        return new CheckList(questions.filter(q => q.questionType == QuestionType.CheckListItem).map(q => new Question(q)), InterfaceInfo.createAllInterfaces());
    }
}
