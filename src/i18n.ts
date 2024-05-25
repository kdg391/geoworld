import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'

i18next
    .use(ICU)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    home: {
                        officialMaps: 'Official Maps',

                        locations: '{locations} Locations',
                        move: 'Move',
                        pan: 'Pan',
                        zoom: 'Zoom',
                        timeLimit: 'Time Limit',
                        noLimit: 'No Limit',
                        timeLimitFormat:
                            '{minutes, number, ::unit/minute} {seconds, number, ::unit/second}',

                        cancel: 'Cancel',
                        play: 'Play',
                    },

                    game: {
                        controls: {
                            returnToStart: 'Return to Start',
                            undo: 'Undo',
                        },
                        roundStatus: {
                            map: 'Map',
                            round: 'Round',
                            score: 'Score',
                        },
                        roundPoints: '+{roundScore} Points',
                        roundResult: {
                            imperial:
                                'Your guess was <strong>{distance, number, ::unit/mile .#}</strong> from the correct location',
                            metric: 'Your guess was <strong>{distance, number, ::unit/kilometer .#}</strong> from the correct location',
                        },
                        viewResults: 'View Results',
                        nextRound: 'Next Round',
                        totalPoints: 'Total {totalScore} Points',
                        replay: 'Replay',
                        exit: 'Exit',
                    },

                    header: {
                        maps: 'Maps',
                    },

                    footer: {
                        theme: 'Theme',
                        themes: {
                            light: 'Light',
                            dark: 'Dark',
                            system: 'System',
                        },
                        language: 'Language',
                        distanceUnit: 'Distance Unit',
                        distanceUnits: {
                            imperial: 'Imperial (mi)',
                            metric: 'Metric (km)',
                        },
                        randomStreetView: 'Random Street View',
                    },

                    worldMap: 'World',
                    countries: {
                        ca: 'Canada',
                        cn: 'China',
                        fr: 'France',
                        gb: 'United Kingdom',
                        it: 'Italy',
                        jp: 'Japan',
                        kr: 'South Korea',
                        sg: 'Singapore',
                        tw: 'Taiwan',
                        us: 'United States',
                    },
                },
            },
            ko: {
                translation: {
                    home: {
                        officialMaps: '공식 맵',

                        locations: '위치 {locations}개',
                        move: '이동',
                        pan: 'Pan',
                        zoom: '줌',
                        timeLimit: '시간 제한',
                        noLimit: '제한 없음',
                        timeLimitFormat:
                            '{minutes, number, ::unit/minute} {seconds, number, ::unit/second}',

                        cancel: '취소',
                        play: '플레이',
                    },

                    game: {
                        controls: {
                            returnToStart: '시작 지점으로 돌아가기',
                            undo: '되돌리기',
                        },
                        roundStatus: {
                            map: '맵',
                            round: '라운드',
                            score: '점수',
                        },
                        roundPoints: '+{roundScore} 포인트',
                        roundResult: {
                            imperial:
                                '정답에서 <strong>{distance, number, ::unit/mile .#}</strong> 떨어짐',
                            metric: '정답에서 <strong>{distance, number, ::unit/kilometer .#}</strong> 떨어짐',
                        },
                        viewResults: '결과 보기',
                        nextRound: '다음 라운드',
                        totalPoints: '총 {totalScore} 포인트',
                        replay: '다시 플레이',
                        exit: '나가기',
                    },

                    header: {
                        maps: '맵',
                    },

                    footer: {
                        theme: '테마',
                        themes: {
                            light: '라이트',
                            dark: '다크',
                            system: '시스템',
                        },
                        language: '언어',
                        distanceUnit: '거리 단위',
                        distanceUnits: {
                            imperial: '마일 (mi)',
                            metric: '미터 (km)',
                        },
                        randomStreetView: '랜덤 스트리트 뷰',
                    },

                    worldMap: '세계',
                    countries: {
                        ca: '캐나다',
                        cn: '중국',
                        fr: '프랑스',
                        gb: '영국',
                        it: '이탈리아',
                        jp: '일본',
                        kr: '한국',
                        sg: '싱가포르',
                        tw: '대만',
                        us: '미국',
                    },
                },
            },
        },
        supportedLngs: ['en', 'ko'],
    })
