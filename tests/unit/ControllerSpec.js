describe('App controllers', function () {

    beforeEach(module('quizApp'));

    describe('HomeController', function () {
        var scope, ctrl;

        beforeEach(inject(function ($rootScope, $controller, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('HomeCtrl', {$scope: scope});
        }));

        it('should be valid name', function () {
            scope.userName = "testUser";
            expect(scope.isValidUserName()).toBeTruthy();
        });

        it('should ignore all spaces as name', function () {
            scope.userName = "      ";
            expect(scope.isValidUserName()).toBeFalsy();
        });

    });

    describe('QuizController', function () {
        var scope, ctrl, $httpMock;

        beforeEach(inject(function ($httpBackend, $rootScope, $controller) {
            $httpMock = $httpBackend;
            $httpMock.expectGET('fixtures/questions.json').
                respond({
                    "title": "Test Quiz",
                    "questions": [
                        {
                            "question": "Two ducks and two dogs have a total of fourteen legs.",
                            "answers": [
                                "true", "false"
                            ],
                            "weight": 2,
                            "type": "radio",
                            "correctAnswer": "false"
                        },
                        {
                            "question": "Which number should come next in the series? 53, 53, 40, 40, 27, 27",
                            "answers": [
                                12, 14, 27, 53
                            ],
                            "weight": 2,
                            "type": "radio",
                            "correctAnswer": "14"
                        }
                    ]
                });

            scope = $rootScope.$new();
            ctrl = $controller('QuizCtrl', {$scope: scope});
        }));

        it('should create "quiz" model with 2 questions', function () {
            expect(scope.quiz).toBeUndefined();
            $httpMock.flush();
            expect(scope.quiz.questionnaire.length).toBe(2);
        });

        it('should be initialized correctly', function () {
            $httpMock.flush();
            expect(scope.currentPosition).toBe(0);
            expect(scope.currentQuestion).toBeDefined();
            expect(scope.hasNext()).toBeTruthy();
            expect(scope.isAnswered()).toBeFalsy();
        });

        it('should add to the score for correct answer', function () {
            $httpMock.flush();
            scope.currentResponse = "false";
            expect(scope.user.score).toBe(0);
            scope.submitAns(scope.currentQuestion.id);
            expect(scope.user.score).toBe(2);
        });

        it('should not add to the score for wrong answer', function () {
            $httpMock.flush();
            scope.currentResponse = "true";
            expect(scope.user.score).toBe(0);
            scope.submitAns(scope.currentQuestion.id);
            expect(scope.user.score).toBe(0);
        });

    });

    describe('ResultController', function () {
        var scope, ctrl;

        beforeEach(inject(function ($rootScope,$controller, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('ResultCtrl', {$scope: scope});
        }));

        it('Quiz size to be 0 on new game', function () {
            scope.quizSize;
            scope.newGame();
            expect(scope.quizSize).toBe(0);
        });
        it('Quiz size to be 0 on play again', function () {
            scope.newGame();
            expect(scope.quizSize).toBe(0);
        });

    });

    describe('HelpController', function () {
        var scope, ctrl, $httpMock;

        beforeEach(inject(function ($httpBackend, $rootScope, $controller) {
            $httpMock = $httpBackend;
            $httpMock.expectGET('fixtures/questions.json').
                respond({
                    "title": "Test Quiz",
                    "questions": [
                        {
                            "question": "Two ducks and two dogs have a total of fourteen legs.",
                            "answers": [
                                "true", "false"
                            ],
                            "weight": 2,
                            "type": "radio",
                            "correctAnswer": "false"
                        },
                        {
                            "question": "Which number should come next in the series? 53, 53, 40, 40, 27, 27",
                            "answers": [
                                12, 14, 27, 53
                            ],
                            "weight": 2,
                            "type": "radio",
                            "correctAnswer": "14"
                        }
                    ] ,
                     "durationPerQuestion": 20,
                });

            scope = $rootScope.$new();
            ctrl = $controller('HelpCtrl', {$scope: scope});
        }));

        it('help view should have quizSize and duration', function () {
            $httpMock.flush();
            expect(scope.quizSize).toBe(2);
            expect(scope.duration).toBe(20);
        });
    })
    describe('localization Controller', function () {
            var scope, ctrl, $httpMock;

            beforeEach(inject(function ($httpBackend, $rootScope, $controller) {
                $httpMock = $httpBackend;
                $httpMock.expectGET('fixtures/languages.json').
                    respond({
                                "options": [
                                    {
                                        "id": "en",
                                        "label": "English (International)"
                                    },
                                    {
                                        "id": "de",
                                        "label": "German"
                                    }
                                ]
                            } );

                scope = $rootScope.$new();
                ctrl = $controller('AppCtrl', {$scope: scope});
            }));

            it('help view should have quizSize and duration', function () {
                $httpMock.flush();
                scope.selected = 'en';
                scope.changeLanguage('de');
                expect(scope.selected).toBe('de');
                expect(scope.languages[0].id).toBe('en');
                expect(scope.languages[1].id).toBe('de');
            });
        })



});

