"use strict";
window.QUIZ_DATA = {
  "meta": {
    "title": "Business Statistics — Midterm Practice",
    "documentTitle": "Midterm Practice — {count} Questions",
    "eyebrow": "25 Multiple-Choice Questions",
    "subtitle": "Chapters 1–6 · Concepts",   
    "chips": [
      "Statistical Reasoning & Data Types",
      "Visualization & Descriptive Statistics",
      "Probability & Independence",
      "Binomial & Poisson",
      "Normal & Uniform"
    ],
    "notesHTML": "<details class=\"notes\">\n<summary>Instructions</summary>\n<p>This practice test contains 25 original four-option questions. Select exactly one answer for each question.</p>\n<ul><li>Questions and answer choices are in English; explanations are in Korean.</li><li>A calculator may be used. Required probability table excerpts are included with the relevant questions.</li><li>Check whether a displayed table contains individual or cumulative probabilities.</li><li>Use the percentile convention and rounding instructions stated in each question.</li></ul>\n</details>",
    "notice": "Calculator permitted · One correct answer per question · Probability tables provided where needed",
    "storageKey": "business_statistics_mid_3",
    "exportFilename": "midterm_practice_results.txt"
  },
  "questions": [
    {
      "id": 1,
      "topic": "Statistical reasoning",
      "kind": "Correct statements",
      "stem": "Which statements are correct?",
      "options": [
        "I only",
        "II and III only",
        "I and III only",
        "I, II, and III"
      ],
      "answer": 2,
      "explain": "Ⅰ·Ⅲ이 옳다. 표본 고객의 응답만 요약하는 것은 기술통계이고, 그 결과를 전체 고객에게 일반화하는 단계가 추론통계이다. 전체 고객의 실제 비율은 모수, 표본에서 계산한 비율은 통계량이다. 표본 수를 늘리는 것만으로 자발적 응답에 따른 선택 편향이 자동으로 없어지지는 않는다.",
      "pages": [],
      "box": "I. Reporting the percentage satisfied among 300 surveyed customers is descriptive statistics; using it to estimate satisfaction among all customers is inferential statistics.\nII. If only customers who voluntarily visit a complaint website are surveyed, increasing the sample size necessarily eliminates selection bias.\nIII. The satisfaction proportion for all customers is a parameter, while the proportion computed from the surveyed customers is a statistic."
    },
    {
      "id": 2,
      "topic": "Data types",
      "kind": "Ordered blanks",
      "stem": "Fill in (A), (B), and (C), in that order.",
      "options": [
        "categorical; discrete quantitative; time series",
        "continuous quantitative; discrete quantitative; cross-sectional",
        "categorical; continuous quantitative; time series",
        "discrete quantitative; categorical; cross-sectional"
      ],
      "answer": 0,
      "explain": "우편번호는 숫자로 기록되어도 크기나 차이가 수량을 의미하지 않는 범주형 변수이다. 하루 반품 개수는 셀 수 있는 이산형 양적 변수이며, 한 매장의 월별 매출은 시간 순서에 따라 관측한 시계열 자료이다. 동일한 한 시점에 여러 매장의 매출을 비교하면 횡단면 자료이다.",
      "pages": [],
      "box": "A. A customer's postal code, used only as a location label, is a(n) ______ variable.\nB. The number of items returned to a store in one day is a(n) ______ variable.\nC. Monthly revenue for one store over 24 consecutive months is ______ data."
    },
    {
      "id": 3,
      "topic": "Frequency distributions",
      "kind": "Most appropriate",
      "stem": String.raw`An analyst has 60 observations and uses the smallest integer k satisfying \(2^k>60\) to choose the number of histogram classes. Which proposal is most appropriate?`,
      "options": [
        "Use 5 classes because the number of classes should be rounded down.",
        "Use 6 classes, with both adjacent intervals including every shared endpoint.",
        "Use 7 classes because 6 classes cannot accommodate 60 observations.",
        "Use 6 classes with nonoverlapping intervals that collectively cover all observations."
      ],
      "answer": 3,
      "explain": "2⁵=32<60이고 2⁶=64>60이므로 최소 k는 6이다. 계급은 상호 배타적이며 모든 관측값을 포함해야 한다. 예를 들어 [10,20), [20,30)처럼 공통 경계가 중복 소속되지 않도록 정한다. 이 계급 수 규칙은 문제에서 지정한 기준이며 모든 자료에서 유일한 최적값이라는 뜻은 아니다.",
      "pages": [],
      "box": null
    },
    {
      "id": 4,
      "topic": "Frequency distributions",
      "kind": "Numerical blanks",
      "stem": "Using the frequency table, let (A) be the relative frequency for 20 to under 30, and let (B) be the cumulative relative frequency below 30. What is A + B?",
      "options": [
        "0.60",
        "1.30",
        "0.75",
        "1.10"
      ],
      "answer": 1,
      "explain": "전체 도수는 40이다. 20 이상 30 미만의 상대도수 A=16/40=0.40이고, 30 미만의 누적 상대도수 B=(8+12+16)/40=0.90이다. 따라서 A+B=1.30이다. 서로 별도로 정의된 두 비율의 합이므로 결과가 1보다 커도 확률 공리를 위반하지 않는다.",
      "pages": [],
      "box": "Value interval | Frequency\n0 to under 10 | 8\n10 to under 20 | 12\n20 to under 30 | 16\n30 to under 40 | 4\nTotal | 40"
    },
    {
      "id": 5,
      "topic": "Data visualization",
      "kind": "Least appropriate",
      "stem": "Which statement about graphical summaries is least appropriate?",
      "options": [
        "An upward pattern in a scatter diagram by itself establishes that increasing one variable causes the other to increase.",
        "An ogive constructed from nonnegative frequencies cannot decrease as the class endpoint increases.",
        "A stem-and-leaf diagram can preserve individual data values when a key specifying the units is provided.",
        "A line chart is useful for displaying a variable observed over successive time periods."
      ],
      "answer": 0,
      "explain": "산점도의 상승 패턴은 양의 관련성을 보여주지만 인과관계 자체를 입증하지는 않는다. 역인과나 공통 요인이 가능하다. 오자이브는 누적값이므로 감소하지 않지만 도수가 0인 구간에서는 수평일 수 있다. 줄기-잎 그림은 단위 키를 주면 개별 값을 보존할 수 있고, 선 그래프는 시계열 변화 표현에 적합하다.",
      "pages": [],
      "box": null
    },
    {
      "id": 6,
      "topic": "Measures of center",
      "kind": "Calculation",
      "stem": "The observations are 2, 3, 3, 5, 7, and 16. Let A be the mean, B the median, and C the mode. What is A + B + C?",
      "options": [
        "12",
        "14",
        "13",
        "15"
      ],
      "answer": 2,
      "explain": "합계는 36, 관측값 수는 6이므로 평균 A=6이다. 중앙값 B=(3+5)/2=4, 최빈값 C=3이므로 A+B+C=13이다. 가장 큰 값 16이 평균을 끌어올리지만 중앙값은 가운데 두 관측값으로 계산한다.",
      "pages": [],
      "box": null
    },
    {
      "id": 7,
      "topic": "Percentiles and quartiles",
      "kind": "Numerical blanks",
      "stem": "For the ordered data below, use this percentile rule: compute i = (p/100)n; if i is not an integer, round it up and use that ordered value; if i is an integer, average the values in positions i and i + 1. Let A be the 25th percentile and B the 75th percentile. What is A + B?",
      "options": [
        "24",
        "26",
        "25",
        "28"
      ],
      "answer": 1,
      "explain": "n=12이다. Q1의 위치 i=0.25×12=3은 정수이므로 3번째와 4번째 값의 평균인 (6+8)/2=7이다. Q3는 i=9이므로 (18+20)/2=19이다. 합은 26이다. 백분위수 계산 규칙에 따라 결과가 달라질 수 있으므로 문항에서 규칙을 명시했다.",
      "pages": [],
      "box": "Ordered data: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 40"
    },
    {
      "id": 8,
      "topic": "Box-and-whisker plots",
      "kind": "Correct statements",
      "stem": "Given Q1 = 10, Q2 = 14, and Q3 = 18, which statements are correct? Use the 1.5-IQR rule.",
      "options": [
        "I only",
        "II only",
        "I, II, and III",
        "I and III only"
      ],
      "answer": 3,
      "explain": "IQR=18−10=8이므로 하한 경계는 10−1.5×8=−2, 상한 경계는 18+1.5×8=30이다. 상자 양 끝은 Q1과 Q3인 10과 18이다. 수염은 경계값 자체가 아니라 경계 안에 있는 실제 관측값까지 이어지므로 상단 수염은 27이다. 31은 상한 경계를 초과하므로 이상치이다.",
      "pages": [],
      "box": "I. The boundaries of the central box are 10 and 18.\nII. If the largest observation not exceeding the upper fence is 27, the upper whisker must nevertheless end at 30.\nIII. An observation of 31 is an upper outlier."
    },
    {
      "id": 9,
      "topic": "Variance and transformations",
      "kind": "Calculation",
      "stem": String.raw`A sample consists of 2, 4, 6, and 8. Each observation is transformed using \(y=3x+10\). What is the sample variance of the transformed data? Use n - 1 in the denominator.`,
      "options": [
        "60",
        "20",
        "45",
        "70"
      ],
      "answer": 0,
      "explain": "원자료의 평균은 5이고 제곱편차 합은 9+1+1+9=20이다. 표본분산은 20/(4−1)=20/3이다. 3배 변환은 편차를 3배, 제곱편차를 9배로 만들므로 새 표본분산은 9×20/3=60이다. 10을 더하는 이동은 분산에 영향을 주지 않는다. 원자료를 모집단으로 취급하여 4로 나누는 오류에 주의한다.",
      "pages": [],
      "box": null
    },
    {
      "id": 10,
      "topic": "Coefficient of variation",
      "kind": "Number of correct statements",
      "stem": "How many statements are correct? All means and standard deviations below are population quantities.",
      "options": [
        "0",
        "2",
        "1",
        "3"
      ],
      "answer": 1,
      "explain": "Ⅰ·Ⅲ이 옳다. A의 CV=4/20×100=20%, B의 CV=6/40×100=15%이므로 절대 표준편차는 A가 작아도 상대 변동성은 B가 작다. A에 10을 더하면 평균은 30, 표준편차는 4이므로 CV는 약 13.33%로 바뀐다. 양의 상수 5를 곱하면 평균과 표준편차가 함께 5배 되어 CV가 보존된다.",
      "pages": [],
      "box": "Population A has mean 20 and standard deviation 4. Population B has mean 40 and standard deviation 6.\nI. Population B has the smaller coefficient of variation.\nII. Adding 10 to every value in Population A leaves its coefficient of variation unchanged.\nIII. Multiplying every value in Population A by 5 leaves its coefficient of variation unchanged."
    },
    {
      "id": 11,
      "topic": "Standardized values",
      "kind": "Ordered blanks",
      "stem": "Scores on Test A have population mean 70 and standard deviation 8. Scores on Test B have population mean 500 and standard deviation 50. A student scores 82 on A and 560 on B. The student's z-scores are (A) and (B), and the stronger performance relative to the respective mean is on (C). Choose the correct sequence.",
      "options": [
        "1.50; 1.20; Test B",
        "1.20; 1.50; Test B",
        "1.50; 1.20; Test A",
        "1.50; 1.12; Test A"
      ],
      "answer": 2,
      "explain": "A의 z=(82−70)/8=1.50, B의 z=(560−500)/50=1.20이다. 각 평균보다 몇 표준편차 높은지를 비교하면 A에서 더 높은 상대 위치에 있다. 원점수 560이 82보다 크다는 이유로 B에서 상대적으로 더 잘했다고 판단하면 안 된다. z점수 계산 자체에 정규분포 가정은 필요하지 않다.",
      "pages": [],
      "box": null
    },
    {
      "id": 12,
      "topic": "Mutual exclusivity and independence",
      "kind": "Most appropriate",
      "stem": "Events A and B are mutually exclusive, with P(A) = 0.30 and P(B) = 0.40. Which statement is most appropriate?",
      "options": [
        "They are dependent because P(A given B) = 0 differs from P(A) = 0.30.",
        "They are independent because they cannot occur together.",
        "They are independent because P(A and B) equals P(A) + P(B).",
        "They are dependent only if they are also collectively exhaustive."
      ],
      "answer": 0,
      "explain": "상호 배타적이면 P(A∩B)=0이다. P(B)>0이므로 P(A|B)=0/0.40=0으로, 원래 P(A)=0.30과 다르다. 따라서 종속이다. 독립이라면 결합확률이 0.30×0.40=0.12여야 한다. 양쪽 확률이 모두 양수라는 조건이 중요하며, 확률 0인 사건까지 포함해 무조건 같은 결론으로 일반화해서는 안 된다.",
      "pages": [],
      "box": null
    },
    {
      "id": 13,
      "topic": "Event relationships",
      "kind": "Number of correct statements",
      "stem": String.raw`How many statements are correct? Assume \(0<P(A)<1\) and \(0<P(B)<1\).`,
      "options": [
        "0",
        "2",
        "3",
        "1"
      ],
      "answer": 3,
      "explain": "Ⅰ만 옳다. 독립이면 P(A∩B)=P(A)P(B)>0이므로 상호 배타적일 수 없다. 전체 포괄적이면 P(A∪B)=1이지만 교집합이 있을 수 있으므로 P(A)+P(B)가 반드시 1인 것은 아니다. 여사건 쌍 A와 Aᶜ는 모두 확률이 양수인 조건에서 상호 배타적이므로 종속이다.",
      "pages": [],
      "box": "I. If A and B are independent, they cannot be mutually exclusive.\nII. If A and B are collectively exhaustive, P(A) + P(B) must equal 1, even when they overlap.\nIII. If B is the complement of A, then A and B are independent."
    },
    {
      "id": 14,
      "topic": "Conditional probability",
      "kind": "Ordered blanks",
      "stem": "A customer is selected uniformly from the 200 customers in the table. Let A be the event that the customer is a member and B the event that the customer purchases online. Fill in P(A given B), P(B given A), and the relationship between A and B, in that order.",
      "options": [
        "0.30; 0.50; dependent",
        "0.60; 0.50; independent",
        "0.60; 0.60; independent",
        "0.50; 0.60; dependent"
      ],
      "answer": 1,
      "explain": "온라인 고객은 100명이며 그중 회원은 60명이므로 P(A|B)=60/100=0.60이다. 회원 120명 중 온라인 구매자는 60명이므로 P(B|A)=60/120=0.50이다. P(A)=120/200=0.60, P(B)=100/200=0.50이고 P(A∩B)=60/200=0.30=0.60×0.50이므로 독립이다. 독립이어도 두 조건부 확률이 서로 같을 필요는 없다.",
      "pages": [],
      "box": "Customer type | Online | In store | Total\nMember | 60 | 60 | 120\nNonmember | 40 | 40 | 80\nTotal | 100 | 100 | 200"
    },
    {
      "id": 15,
      "topic": "Joint and conditional probabilities",
      "kind": "Calculation",
      "stem": "A randomly selected item is found to be defective. Using the production and defect probabilities below, what is the probability that the item came from Plant B?",
      "options": [
        "0.06",
        "0.30",
        "0.60",
        "0.40"
      ],
      "answer": 2,
      "explain": "A산 불량품의 결합확률은 0.60×0.02=0.012, B산 불량품은 0.40×0.045=0.018이다. 전체 불량 확률은 0.030이다. 따라서 P(B|불량)=0.018/0.030=0.60이다. B의 불량률 0.045는 P(불량|B)이므로 구하려는 조건부 확률과 방향이 다르다.",
      "pages": [],
      "box": "Plant | Share of total production | P(defective given plant)\nA | 0.60 | 0.020\nB | 0.40 | 0.045\nThe plants account for all production."
    },
    {
      "id": 16,
      "topic": "Discrete probability distributions",
      "kind": "Numerical blanks",
      "stem": "The table gives the complete probability distribution of X. Let A = E(X) and B = Var(X). What is A + B?",
      "options": [
        "3.16",
        "3.76",
        "5.36",
        "4.16"
      ],
      "answer": 3,
      "explain": "E(X)=0×0.20+2×0.50+4×0.30=2.20이다. 분산은 (0−2.2)²×0.20+(2−2.2)²×0.50+(4−2.2)²×0.30=0.968+0.020+0.972=1.96이다. 따라서 A+B=2.20+1.96=4.16이다. 확률분포의 분산에서는 표본분산처럼 n−1로 나누지 않는다.",
      "pages": [],
      "box": "x | P(X = x)\n0 | 0.20\n2 | 0.50\n4 | 0.30"
    },
    {
      "id": 17,
      "topic": "Binomial assumptions",
      "kind": "Cannot fill the blank",
      "stem": "Which situation CANNOT fill the blank in the sentence below? Interpret 'binomial' as an exact model, not an approximation.",
      "options": [
        "Select 5 items without replacement from a batch of 10 containing exactly 3 defectives, and count the defectives selected.",
        "Inspect 12 independently produced items, each with defect probability 0.10, and count the defectives.",
        "Record 20 independent guesses on two-choice questions, each with success probability 0.50, and count correct answers.",
        "Contact 8 independent customers, each with purchase probability 0.30, and count the purchasers."
      ],
      "answer": 0,
      "explain": "크기가 작은 유한한 집단에서 비복원추출하면 이전 추출 결과에 따라 다음 불량 확률이 달라지며 시행이 독립도 아니다. 따라서 정확한 이항모형의 조건을 충족하지 않는다. 나머지는 시행 수 고정, 이진 결과, 독립성, 일정한 성공확률을 명시하므로 이항모형에 해당한다.",
      "pages": [],
      "box": "The number of successes has a binomial distribution when we ______."
    },
    {
      "id": 18,
      "topic": "Binomial: blind guessing",
      "kind": "Calculation",
      "stem": "Eighteen participants independently perform a two-brand blind identification test. If each participant is merely guessing, the probability of a correct answer is 0.50. What is the probability that fewer than 6 participants answer correctly? Use the table.",
      "options": [
        "0.1189",
        "0.9519",
        "0.0481",
        "0.0154"
      ],
      "answer": 2,
      "explain": "정답자 수 X는 Binomial(18,0.50)이다. fewer than 6은 X<6이고 정수값을 가지므로 X≤5와 같다. 따라서 누적표에서 F(5)=0.0481을 읽는다. F(6)=0.1189를 쓰면 정확히 6명인 경우까지 포함하는 오류가 된다.",
      "pages": [],
      "box": "Cumulative binomial table: X ~ Binomial(18, 0.50)\nF(k) = P(X <= k); entries rounded to 4 decimals.\nk | F(k)\n3 | 0.0038\n4 | 0.0154\n5 | 0.0481\n6 | 0.1189\n7 | 0.2403"
    },
    {
      "id": 19,
      "topic": "Binomial: reliability",
      "kind": "Calculation",
      "stem": "A device requires 9 working batteries for a mission. A technician brings 12 batteries, each of which independently has probability 0.20 of failing during the mission. All batteries that do not fail are usable. What is the probability that there are enough working batteries? Use the table.",
      "options": [
        "0.5583",
        "0.7946",
        "0.2054",
        "0.9274"
      ],
      "answer": 1,
      "explain": "불량 배터리 수 X를 Binomial(12,0.20)으로 두면, 정상 배터리가 9개 이상이라는 조건은 12−X≥9, 즉 X≤3이다. 따라서 확률은 F(3)=0.7946이다. 불량이 3개인 경우도 정상 배터리 9개가 남아 임무를 수행할 수 있으므로 포함해야 한다.",
      "pages": [],
      "box": "Cumulative binomial table: X = number of failed batteries\nX ~ Binomial(12, 0.20); F(k) = P(X <= k).\nk | F(k)\n1 | 0.2749\n2 | 0.5583\n3 | 0.7946\n4 | 0.9274\n5 | 0.9806\nEntries are rounded to 4 decimals."
    },
    {
      "id": 20,
      "topic": "Binomial: cumulative tables",
      "kind": "Calculation",
      "stem": "Ten independent customers each make a purchase with probability 0.40. What is the probability that at least 4 but no more than 6 customers make a purchase? Use the displayed table values.",
      "options": [
        "0.3121",
        "0.7780",
        "0.9452",
        "0.5629"
      ],
      "answer": 3,
      "explain": "구하려는 범위는 4≤X≤6이다. 누적분포를 쓰면 P(4≤X≤6)=F(6)−F(3)=0.9452−0.3823=0.5629이다. F(6)−F(4)는 정확히 4명이 구매하는 경우를 제외하므로 틀린다. 문항은 제시된 반올림 표 값에 따른 계산을 요구한다.",
      "pages": [],
      "box": "Cumulative binomial table: X ~ Binomial(10, 0.40)\nF(k) = P(X <= k); entries rounded to 4 decimals.\nk | F(k)\n2 | 0.1673\n3 | 0.3823\n4 | 0.6331\n5 | 0.8338\n6 | 0.9452\n7 | 0.9877"
    },
    {
      "id": 21,
      "topic": "Poisson: time intervals",
      "kind": "Calculation",
      "stem": "Customers arrive randomly and independently at a constant average rate of 12 per hour. Assume a Poisson model. What is the probability of fewer than 3 arrivals during a 15-minute interval? Use the displayed table.",
      "options": [
        "0.4232",
        "0.6472",
        "0.2240",
        "0.5768"
      ],
      "answer": 0,
      "explain": "관찰 구간 15분은 0.25시간이므로 구간 평균은 12×0.25=3이다. 따라서 X~Poisson(3)이고 X<3은 X≤2이다. 제시된 개별 확률을 더하면 0.0498+0.1494+0.2240=0.4232이다. 시간당 발생률 12를 구간 평균으로 그대로 사용하거나 X=3까지 포함하면 안 된다.",
      "pages": [],
      "box": "Poisson probability table for interval mean m = 3\nThis table gives individual probabilities, NOT cumulative probabilities.\nx | P(X = x)\n0 | 0.0498\n1 | 0.1494\n2 | 0.2240\n3 | 0.2240\n4 | 0.1680\nEntries are rounded to 4 decimals."
    },
    {
      "id": 22,
      "topic": "Poisson: spatial intervals",
      "kind": "Ordered blanks",
      "stem": "Defects occur according to a homogeneous Poisson model at an average rate of 0.8 per square meter. For a 4.5-square-meter panel, let A be the expected defect count, B its variance, and C the probability of fewer than 4 defects. Which sequence gives A, B, and C? Use the cumulative table.",
      "options": [
        "0.8; 0.8; 0.5152",
        "3.6; 3.6; 0.5152",
        "3.6; 1.8974; 0.7064",
        "3.6; 3.6; 0.7064"
      ],
      "answer": 1,
      "explain": "단위면적당 발생률은 0.8이고 면적은 4.5이므로 관찰 영역의 평균은 m=0.8×4.5=3.6이다. 포아송분포의 평균과 분산은 모두 m이므로 A=B=3.6이다. 1.8974는 분산이 아니라 표준편차 √3.6의 근삿값이다. fewer than 4는 X≤3이므로 C=F(3)=0.5152이다.",
      "pages": [],
      "box": "Cumulative Poisson table for interval mean m = 3.6\nF(k) = P(X <= k); entries rounded to 4 decimals.\nk | F(k)\n0 | 0.0273\n1 | 0.1257\n2 | 0.3027\n3 | 0.5152\n4 | 0.7064"
    },
    {
      "id": 23,
      "topic": "Normal distributions",
      "kind": "Number of correct statements",
      "stem": "How many statements are correct? X has a normal distribution with mean 100 and standard deviation 12.",
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "answer": 2,
      "explain": "Ⅰ·Ⅱ가 옳다. 연속확률변수는 특정 한 점의 확률이 0이므로 P(X=100)=0이다. 76과 124는 평균에서 각각 2표준편차 떨어진 값이므로 그 사이는 약 95%이다. Z=(X−100)/12는 표준정규분포를 따라 평균 0, 표준편차 1이다. 표준화했다고 원래 표준편차 12가 남는 것은 아니다.",
      "pages": [],
      "box": "I. P(X = 100) = 0, even though the density is highest at 100.\nII. Approximately 95% of the distribution lies between 76 and 124.\nIII. The variable Z = (X - 100)/12 has mean 0 and standard deviation 12."
    },
    {
      "id": 24,
      "topic": "Normal probabilities and quantiles",
      "kind": "Ordered blanks",
      "stem": "Delivery time X is normally distributed with mean 100 minutes and standard deviation 12 minutes. Let A = P(82 < X < 124). Let B be the time exceeded by only 10% of deliveries. Which sequence gives A and B? Use the table and round B to two decimals.",
      "options": [
        "0.4104; 115.38 minutes",
        "0.9104; 84.62 minutes",
        "0.9332; 124.00 minutes",
        "0.9104; 115.38 minutes"
      ],
      "answer": 3,
      "explain": "82의 z는 (82−100)/12=−1.50, 124의 z는 2.00이다. 표는 0부터 양의 z까지의 면적이므로 A=0.4332+0.4772=0.9104이다. 10%만 초과하는 B는 누적확률 90% 지점이다. 평균과 그 지점 사이의 면적은 0.40이므로 z≈1.2816, B=100+12×1.2816=115.3792≈115.38분이다. 84.62분은 하위 10% 경계에 해당한다.",
      "pages": [],
      "box": "Standard normal table: A(z) = P(0 < Z < z), for z >= 0\nz | A(z)\n1.00 | 0.3413\n1.2816 | 0.4000\n1.50 | 0.4332\n2.00 | 0.4772\nUse symmetry for negative z. Displayed entries are rounded."
    },
    {
      "id": 25,
      "topic": "Continuous uniform distributions",
      "kind": "Correct statements",
      "stem": "A waiting time X, measured in hours, is uniformly distributed on [0.2, 0.6]. Which statements are correct?",
      "options": [
        "I, II, and III",
        "I and II only",
        "II and III only",
        "I and III only"
      ],
      "answer": 0,
      "explain": "구간 길이는 0.6−0.2=0.4이므로 밀도는 1/0.4=2.5이다. 밀도값은 확률 자체가 아니어서 1보다 커도 되며, 전체 면적은 2.5×0.4=1이다. X>0.4라는 조건 아래 가능한 구간 길이는 0.2이고 그중 X>0.5의 구간 길이는 0.1이므로 조건부 확률은 0.1/0.2=0.50이다. 연속분포에서 정확히 한 점 X=0.4일 확률은 0이다.",
      "pages": [],
      "box": "I. The probability density is 2.5 per hour throughout the interval; this does not violate the rule that probabilities cannot exceed 1.\nII. P(X > 0.5 given X > 0.4) = 0.50.\nIII. P(X = 0.4) = 0."
    }
  ]
};
