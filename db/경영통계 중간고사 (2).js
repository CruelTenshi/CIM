"use strict";
window.QUIZ_DATA = {
  "meta": {
    "title": "Business Statistics — Midterm Practice",
    "documentTitle": "Midterm Practice — {count} Questions",
    "eyebrow": "25 Multiple-Choice Questions",
    "subtitle": "Chapters 1–6 · Concepts",
    "chips": [
      "Introduction",
      "Data Visualization",
      "Data Description",
      "Probability",
      "Discrete Distributions",
      "Continuous Distributions"
    ],
    "notesHTML": "<details class=\"notes\">\n<summary>Instructions</summary>\n<p>This practice set contains 25 original multiple-choice questions. Each question has four options and exactly one correct answer.</p>\n<ul>\n<li>Questions and options are in English; explanations are in Korean.</li>\n<li>Use a calculator when needed. Required distribution-table excerpts are included with the relevant questions.</li>\n<li>Distinguish cumulative probabilities from individual probabilities. Use the percentile convention stated in the question.</li>\n<li>Use the displayed table values for calculations involving rounded probabilities.</li>\n</ul>\n</details>",
    "notice": "Calculator allowed · One correct answer per question · Required probability tables included",
    "storageKey": "business_statistics_mid_2",
    "exportFilename": "midterm_practice_results.txt"
  },
  "questions": [
    {
      "id": 1,
      "topic": "Ch. 1 — Introduction",
      "kind": "Most appropriate",
      "stem": "A retailer surveys 200 customers and uses their responses to estimate the satisfaction level of all its customers. Which statistical procedure is the retailer primarily using?",
      "options": [
        "Descriptive statistics only",
        "Inferential statistics",
        "A census of the entire customer population",
        "A frequency distribution without any population conclusion"
      ],
      "answer": 1,
      "explain": "표본 200명의 응답을 이용해 전체 고객인 모집단의 만족도를 추정하므로 추론통계에 해당한다. 기술통계는 수집한 자료 자체를 정리·요약하는 데 초점을 두며, 전수조사는 모집단 전체를 조사하는 것이다.",
      "pages": [],
      "box": null
    },
    {
      "id": 2,
      "topic": "Ch. 1 — Introduction",
      "kind": "Ordered blanks",
      "stem": "A company has 5,000 employees. An analyst selects 150 employees and calculates their average commuting time. The 5,000 employees form the (A), the 150 selected employees form the (B), and the calculated average is a (C). Which sequence correctly fills the blanks?",
      "options": [
        "Sample / Population / Parameter",
        "Population / Sample / Parameter",
        "Population / Statistic / Sample",
        "Population / Sample / Statistic"
      ],
      "answer": 3,
      "explain": "분석 대상 전체인 5,000명은 모집단, 그중 선택된 150명은 표본이다. 표본의 관측값으로 계산한 평균은 통계량이며, 모집단 전체의 특성을 요약하는 값인 모수와 구별된다.",
      "pages": [],
      "box": null
    },
    {
      "id": 3,
      "topic": "Ch. 1 — Introduction",
      "kind": "Least appropriate",
      "stem": "Which statement about data types and data collection is LEAST appropriate?",
      "options": [
        "Increasing the number of respondents necessarily eliminates selection bias.",
        "The number of customer complaints received in a day is discrete quantitative data.",
        "The exact time required to complete a delivery is continuous quantitative data.",
        "Monthly sales for one store over several years are time-series data."
      ],
      "answer": 0,
      "explain": "표본 크기가 커져도 표본을 선택하는 방식에 편향이 있으면 대표성이 자동으로 확보되지 않는다. 불만 건수는 셀 수 있는 이산형 자료, 정확한 소요 시간은 연속형 자료, 한 매장의 월별 매출 추이는 시계열 자료다.",
      "pages": [],
      "box": null
    },
    {
      "id": 4,
      "topic": "Ch. 2 — Data Visualization",
      "kind": "Calculation",
      "stem": "A survey records how far 480 fans travel to a stadium. Of these fans, 168 travel at least 10 miles but less than 20 miles. What is the relative frequency of this class?",
      "options": [
        "0.168",
        "0.480",
        "0.350",
        "2.857"
      ],
      "answer": 2,
      "explain": String.raw`상대도수는 해당 계급의 도수를 전체 관측값 수로 나눈 값이다. 따라서 \(168/480=0.350\), 즉 35%다. 도수 168 자체나 전체 표본 수 480을 상대도수로 해석하면 안 된다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 5,
      "topic": "Ch. 2 — Data Visualization",
      "kind": "Numerical blank",
      "stem": String.raw`A data set contains 90 observations. Using the smallest integer \(k\) satisfying \(2^k>n\) as the class-count guideline, the number of histogram classes is (A). What is A?`,
      "options": [
        "7",
        "6",
        "8",
        "9"
      ],
      "answer": 0,
      "explain": String.raw`\(2^6=64\)는 90보다 작고, \(2^7=128\)은 90보다 크다. 따라서 조건을 만족하는 가장 작은 정수는 7이다. 이는 문제에서 지정한 계급 수 결정 지침을 적용한 결과다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 6,
      "topic": "Ch. 2 — Data Visualization",
      "kind": "Correct statements",
      "stem": "Which of statements I, II, and III are correct?",
      "options": [
        "I only",
        "I and III only",
        "II and III only",
        "I, II, and III"
      ],
      "answer": 1,
      "explain": "I과 III이 옳다. 오자이브는 누적 상대도수를 나타내므로 감소하지 않으며 마지막 값은 1이다. 산점도에서 함께 움직이는 경향이 보여도 그것만으로 인과관계를 입증할 수 없다. 반올림하지 않은 줄기-잎 그림은 각 관측값을 보존한다.",
      "pages": [],
      "box": "I. An ogive of cumulative relative frequencies is nondecreasing and ends at 1.\nII. A scatter diagram showing an upward pattern proves that one variable causes the other.\nIII. A stem-and-leaf display can retain the individual observed values when no rounding is used."
    },
    {
      "id": 7,
      "topic": "Ch. 2 — Data Visualization",
      "kind": "Sum of numerical blanks",
      "stem": "The table summarizes 40 delivery times. Let A be the cumulative relative frequency for delivery times below 20 minutes, and let B be the relative frequency for the class from 20 to under 30 minutes. What is A + B?",
      "options": [
        "0.40",
        "0.50",
        "0.90",
        "0.65"
      ],
      "answer": 3,
      "explain": String.raw`20분 미만은 첫 두 계급이므로 \(A=(6+10)/40=0.40\)이다. 세 번째 계급의 상대도수는 \(B=10/40=0.25\)다. 따라서 \(A+B=0.65\)이며, 누적도수와 개별 계급의 도수를 구분해야 한다.`,
      "pages": [],
      "box": "Delivery time (minutes) | Frequency\n0 to under 10 | 6\n10 to under 20 | 10\n20 to under 30 | 10\n30 to under 40 | 14\nTotal | 40"
    },
    {
      "id": 8,
      "topic": "Ch. 3 — Data Description",
      "kind": "Sum of numerical blanks",
      "stem": "For the observations 3, 4, 4, 7, and 12, let A be the arithmetic mean, B the median, and C the mode. What is A + B + C?",
      "options": [
        "12",
        "13",
        "14",
        "16"
      ],
      "answer": 2,
      "explain": String.raw`관측값의 합은 30이고 개수는 5이므로 평균 \(A=6\)이다. 정렬된 자료의 세 번째 값이 중앙값이므로 \(B=4\), 가장 자주 나타나는 값이 4이므로 \(C=4\)다. 합은 \(6+4+4=14\)다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 9,
      "topic": "Ch. 3 — Data Description",
      "kind": "Percentile location",
      "stem": String.raw`A data set contains 80 values sorted from smallest to largest. Locate the 35th percentile using \(i=(p/100)n\): if \(i\) is an integer, average the values in positions \(i\) and \(i+1\); otherwise, round \(i\) up and use that position. Which value should be used?`,
      "options": [
        "The 28th value only",
        "The average of the 28th and 29th values",
        "The 29th value only",
        "The average of the 35th and 36th values"
      ],
      "answer": 1,
      "explain": String.raw`백분위 위치지수는 \(i=0.35\times80=28\)이다. 문제에서 지정한 규칙에 따라 지수가 정수이면 28번째 값과 29번째 값의 평균을 사용한다. 28은 백분위수의 값 자체가 아니라 정렬된 자료에서의 위치지수다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 10,
      "topic": "Ch. 3 — Data Description",
      "kind": "Most appropriate",
      "stem": String.raw`A data set has \(Q_1=18\), a median of 25, and \(Q_3=34\). Its minimum is 8, its maximum is 60, and its largest observation not exceeding the upper outlier fence is 56. Using the \(1.5\,IQR\) rule, which description of its box-and-whisker plot is correct?`,
      "options": [
        "The box extends from 18 to 34, the upper whisker ends at 56, and 60 is an outlier.",
        "The box extends from 8 to 60, and there are no outliers.",
        "The box extends from 18 to 34, and the upper whisker must end at the upper fence of 58.",
        "The box extends from 25 to 34, and 56 is an outlier."
      ],
      "answer": 0,
      "explain": String.raw`\(IQR=34-18=16\)이므로 하한 울타리는 \(18-1.5(16)=-6\), 상한 울타리는 \(34+1.5(16)=58\)이다. 상자는 첫째 사분위수 18에서 셋째 사분위수 34까지 그린다. 위쪽 수염은 상한 이내의 실제 최댓값 56에서 끝나며, 60은 58을 초과하므로 이상치다. 울타리와 수염 끝은 반드시 같지 않다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 11,
      "topic": "Ch. 3 — Data Description",
      "kind": "Calculation",
      "stem": "Consider the sample observations 2, 4, 6, 8, and 10. What is the sample variance?",
      "options": [
        "8",
        String.raw`\(\sqrt{10}\)`,
        "40",
        "10"
      ],
      "answer": 3,
      "explain": String.raw`표본평균은 6이고 제곱편차의 합은 \(16+4+0+4+16=40\)이다. 표본분산은 \(n-1=4\)로 나누므로 \(s^2=40/4=10\)이다. 8은 분모를 5로 사용한 값이며, \(\sqrt{10}\)은 표본표준편차다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 12,
      "topic": "Ch. 3 — Data Description",
      "kind": "Calculation and interpretation",
      "stem": "Product A has a mean weekly demand of 40 units and a standard deviation of 6 units. Product B has a mean weekly demand of 100 units and a standard deviation of 10 units. Which product has lower relative variation, and what is its coefficient of variation?",
      "options": [
        "Product A; 6%",
        "Product A; 15%",
        "Product B; 10%",
        "Product B; 25%"
      ],
      "answer": 2,
      "explain": String.raw`변동계수는 \(CV=(\text{표준편차}/\text{평균})\times100\%\)다. A는 \(6/40\times100=15\%\), B는 \(10/100\times100=10\%\)이므로 B의 상대적 변동성이 작다. 표준편차 자체가 더 커도 평균에 대한 비율은 더 작을 수 있다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 13,
      "topic": "Ch. 4 — Probability",
      "kind": "Conditional probability",
      "stem": "An order is selected at random from the 300 orders in the table. Given that the order was expedited, what is the probability that it was shipped from Warehouse B?",
      "options": [
        "0.45",
        "0.15",
        "0.30",
        "0.50"
      ],
      "answer": 0,
      "explain": String.raw`신속 배송 주문이라는 조건이 있으므로 분모는 전체 주문 300건이 아니라 신속 배송 주문 \(30+45+25=100\)건이다. 그중 B 창고에서 보낸 주문은 45건이므로 조건부확률은 \(45/100=0.45\)다. \(45/300=0.15\)는 B 창고이면서 신속 배송일 결합확률이다.`,
      "pages": [],
      "box": "Warehouse | Expedited | Standard | Total\nA | 30 | 70 | 100\nB | 45 | 55 | 100\nC | 25 | 75 | 100\nTotal | 100 | 200 | 300"
    },
    {
      "id": 14,
      "topic": "Ch. 4 — Probability",
      "kind": "Number of correct statements",
      "stem": "How many of statements I, II, and III are correct? Assume that both events have positive probability whenever conditional probabilities are used.",
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "answer": 2,
      "explain": String.raw`I과 II가 옳으므로 정답은 2개다. 양의 확률을 가진 배타적 사건은 \(P(A\cap B)=0\)이지만 \(P(A)P(B)>0\)이므로 독립이 아니다. 독립인 두 사건은 동시에 발생할 수 있으며, 전체 포괄적이라는 조건은 합집합이 표본공간이라는 뜻일 뿐 교집합이 없다는 뜻은 아니다.`,
      "pages": [],
      "box": "I. Two mutually exclusive events with positive probabilities cannot be independent.\nII. Two independent events can occur together.\nIII. Any two collectively exhaustive events must also be mutually exclusive."
    },
    {
      "id": 15,
      "topic": "Ch. 4 — Probability",
      "kind": "Calculation",
      "stem": "Among a retailer's customers, 55% use its mobile app, 40% use its website, and 20% use both. What is the probability that a randomly selected customer uses neither the app nor the website?",
      "options": [
        "0.05",
        "0.20",
        "0.75",
        "0.25"
      ],
      "answer": 3,
      "explain": String.raw`앱 또는 웹사이트를 사용하는 확률은 덧셈법칙에 따라 \(0.55+0.40-0.20=0.75\)다. 어느 쪽도 사용하지 않는 사건은 이 합집합의 여사건이므로 확률은 \(1-0.75=0.25\)다. 둘 다 사용하는 고객을 중복해서 더하지 않도록 교집합을 한 번 빼야 한다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 16,
      "topic": "Ch. 4 — Probability",
      "kind": "Ordered blanks",
      "stem": "Two independent quality checks are performed on an item. The probability of passing Check A is 0.80, and the probability of passing Check B is 0.90. The probability of passing both checks is (A), and the probability of passing at least one check is (B). Which pair correctly fills A and B, respectively?",
      "options": [
        "0.72 / 0.28",
        "0.72 / 0.98",
        "0.80 / 0.90",
        "0.98 / 0.72"
      ],
      "answer": 1,
      "explain": String.raw`독립이므로 둘 다 통과할 확률은 \(0.80\times0.90=0.72\)다. 적어도 하나를 통과할 확률은 \(0.80+0.90-0.72=0.98\)이다. 두 검사에서 모두 탈락할 확률 \(0.20\times0.10=0.02\)를 1에서 빼서 구할 수도 있다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 17,
      "topic": "Ch. 5 — Discrete Distributions",
      "kind": "Ordered numerical blanks",
      "stem": "The table gives the complete probability distribution of X, the number of service calls received during a short interval. What are the expected value and variance of X, respectively?",
      "options": [
        "1.4 / 0.80",
        "1.0 / 0.64",
        "1.4 / 0.64",
        "0.64 / 1.4"
      ],
      "answer": 2,
      "explain": String.raw`기댓값은 \(E(X)=0(0.2)+1(0.2)+2(0.6)=1.4\)다. 분산은 \((0-1.4)^2(0.2)+(1-1.4)^2(0.2)+(2-1.4)^2(0.6)=0.64\)다. 표준편차는 \(\sqrt{0.64}=0.8\)이므로 분산과 혼동하면 안 된다.`,
      "pages": [],
      "box": "x | P(X = x)\n0 | 0.20\n1 | 0.20\n2 | 0.60\nTotal probability | 1.00"
    },
    {
      "id": 18,
      "topic": "Ch. 5 — Discrete Distributions",
      "kind": "Cannot fill the blank",
      "stem": "Which statement CANNOT correctly fill the blank in the description of a binomial experiment?",
      "options": [
        "The probability of success must change after each trial.",
        "There is a fixed number of trials.",
        "Each trial has only two possible outcomes.",
        "The trials are independent of one another."
      ],
      "answer": 0,
      "explain": "이항실험에서는 시행 횟수가 고정되고, 각 시행의 결과는 성공과 실패 두 가지이며, 시행들이 서로 독립이어야 한다. 또한 성공확률은 시행마다 일정하게 유지되어야 한다. 따라서 성공확률이 매번 변해야 한다는 설명은 빈칸에 들어갈 수 없다.",
      "pages": [],
      "box": "For an experiment to have a binomial distribution, __________."
    },
    {
      "id": 19,
      "topic": "Ch. 5 — Discrete Distributions",
      "kind": "Binomial table calculation",
      "stem": "A sales representative independently contacts 8 customers. Each customer makes a purchase with probability 0.30. Using the cumulative binomial table, what is the probability that at least 3 customers make a purchase?",
      "options": [
        "0.5518",
        "0.4482",
        "0.2541",
        "0.8059"
      ],
      "answer": 1,
      "explain": String.raw`구매 고객 수를 \(X\)라 하면 \(X\sim\operatorname{Binomial}(8,0.30)\)이다. 적어도 3명은 \(X\ge3\)이므로 \(P(X\ge3)=1-P(X\le2)=1-0.5518=0.4482\)다. 표는 개별확률이 아니라 누적확률을 제공하므로 경계가 2인지 3인지 주의해야 한다.`,
      "pages": [],
      "box": "Cumulative binomial table: n = 8, p = 0.30\nx | P(X <= x)\n0 | 0.0576\n1 | 0.2553\n2 | 0.5518\n3 | 0.8059\n4 | 0.9420\n5 | 0.9887\n6 | 0.9987\n7 | 0.9999\n8 | 1.0000\nProbabilities are rounded to four decimal places."
    },
    {
      "id": 20,
      "topic": "Ch. 5 — Discrete Distributions",
      "kind": "Poisson table calculation",
      "stem": "Customers arrive at a help desk according to a Poisson model at a constant average rate of 8 per hour. What is the probability that exactly 3 customers arrive during a 15-minute interval? Use the table provided.",
      "options": [
        "0.0286",
        "0.2707",
        "0.0902",
        "0.1804"
      ],
      "answer": 3,
      "explain": String.raw`15분은 \(0.25\)시간이므로 관심 구간의 평균은 \(\lambda t=8\times0.25=2\)명이다. 따라서 평균 2의 열에서 \(x=3\)인 행을 읽어 \(P(X=3)=0.1804\)를 얻는다. 시간당 발생률 8을 15분 구간의 평균으로 그대로 사용하면 안 된다.`,
      "pages": [],
      "box": "Poisson probability table: entries are P(X = x)\nx | Interval mean = 2 | Interval mean = 8\n0 | 0.1353 | 0.0003\n1 | 0.2707 | 0.0027\n2 | 0.2707 | 0.0107\n3 | 0.1804 | 0.0286\n4 | 0.0902 | 0.0573\nSelected rows only; probabilities are rounded to four decimal places."
    },
    {
      "id": 21,
      "topic": "Ch. 5 — Discrete Distributions",
      "kind": "Poisson table calculation",
      "stem": "Calls arrive according to a Poisson model at a constant average rate of 6 per hour. Using the table, what is the probability of fewer than 3 calls during a 30-minute interval?",
      "options": [
        "0.4232",
        "0.6472",
        "0.2240",
        "0.5768"
      ],
      "answer": 0,
      "explain": String.raw`30분 구간의 평균은 \(\lambda t=6\times0.5=3\)이다. 3건 미만은 0건, 1건, 2건이므로 \(0.0498+0.1494+0.2240=0.4232\)다. 3건일 확률까지 더한 0.6472는 3건 이하의 확률이다. 포아송분포에서는 이 구간의 평균과 분산이 모두 3이다.`,
      "pages": [],
      "box": "Poisson probability table: interval mean = 3\nx | P(X = x)\n0 | 0.0498\n1 | 0.1494\n2 | 0.2240\n3 | 0.2240\n4 | 0.1680\nSelected rows only; probabilities are rounded to four decimal places."
    },
    {
      "id": 22,
      "topic": "Ch. 6 — Continuous Distributions",
      "kind": "Normal table calculation",
      "stem": "The time required to process an individual order is normally distributed with a mean of 50 minutes and a standard deviation of 8 minutes. What is the probability that a randomly selected order takes more than 62 minutes to process?",
      "options": [
        "0.4332",
        "0.0668",
        "0.9332",
        "0.1587"
      ],
      "answer": 1,
      "explain": String.raw`표준화하면 \(z=(62-50)/8=1.50\)이다. 표가 제공하는 값은 평균 0에서 양의 z값까지의 면적이므로, 오른쪽 꼬리확률은 \(P(Z>1.50)=0.5-0.4332=0.0668\)이다. 표의 0.4332를 누적확률이나 꼬리확률로 그대로 쓰면 안 된다.`,
      "pages": [],
      "box": "Standard normal table: entries are P(0 < Z < z)\nz | Area\n0.50 | 0.1915\n1.00 | 0.3413\n1.50 | 0.4332\n2.00 | 0.4772"
    },
    {
      "id": 23,
      "topic": "Ch. 6 — Continuous Distributions",
      "kind": "Normal interval calculation",
      "stem": "Package weights are normally distributed with a mean of 200 grams and a standard deviation of 10 grams. What is the probability that a randomly selected package weighs between 190 and 220 grams?",
      "options": [
        "0.1359",
        "0.4772",
        "0.9544",
        "0.8185"
      ],
      "answer": 3,
      "explain": String.raw`190g과 220g을 표준화하면 각각 \(z=-1\), \(z=2\)다. 따라서 평균을 기준으로 양쪽 면적을 더하여 \(P(-1<Z<2)=0.3413+0.4772=0.8185\)다. 서로 같은 쪽에 있는 두 z값의 구간확률처럼 면적을 빼면 안 된다.`,
      "pages": [],
      "box": "Standard normal table: entries are P(0 < Z < z)\nz | Area\n0.50 | 0.1915\n1.00 | 0.3413\n1.50 | 0.4332\n2.00 | 0.4772\nFor negative z-values, use symmetry about zero."
    },
    {
      "id": 24,
      "topic": "Ch. 6 — Continuous Distributions",
      "kind": "Ordered numerical blanks",
      "stem": "A customer's waiting time X is continuously and uniformly distributed between 4 and 16 minutes. The probability that X exceeds 13 minutes is (A), and the probability that X is exactly 10 minutes is (B). Which pair correctly fills A and B, respectively?",
      "options": [
        "0.75 / 0",
        String.raw`\(0.25\,/\,\frac{1}{12}\)`,
        "0.25 / 0",
        String.raw`\(0.75\,/\,\frac{1}{12}\)`
      ],
      "answer": 2,
      "explain": String.raw`전체 구간의 길이는 \(16-4=12\), 13분을 초과하는 구간의 길이는 \(16-13=3\)이므로 \(A=3/12=0.25\)다. 연속분포에서 정확히 한 값일 확률은 0이므로 \(B=0\)이다. 밀도 \(1/12\)는 한 점의 확률이 아니다.`,
      "pages": [],
      "box": null
    },
    {
      "id": 25,
      "topic": "Ch. 6 — Continuous Distributions",
      "kind": "Number of correct statements",
      "stem": "How many of statements I, II, and III are correct?",
      "options": [
        "3",
        "0",
        "1",
        "2"
      ],
      "answer": 0,
      "explain": String.raw`세 문장 모두 옳다. 정규분포는 대칭인 종 모양이어서 평균·중앙값·최빈값이 일치하고, 경험적 법칙에 따라 평균에서 약 2표준편차 이내에 약 95%가 포함된다. 연속균등분포에서는 \(\mu=(a+b)/2=(2+14)/2=8\), \(\sigma=\sqrt{(b-a)^2/12}=\sqrt{144/12}=\sqrt{12}\)다.`,
      "pages": [],
      "box": String.raw`I. In a normal distribution, the mean, median, and mode coincide.
II. Approximately 95% of a normal distribution lies within two standard deviations of its mean.
III. A continuous uniform distribution on [2, 14] has mean 8 and standard deviation \(\sqrt{12}\).`
    }
  ]
};
