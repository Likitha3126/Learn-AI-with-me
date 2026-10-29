// src/data/roadmap.ts
// ─────────────────────────────────────────────────────────────────────────────
// CREATOR-CONTROLLED ROADMAP DATA
//
// HOW TO UPDATE A DAY'S ARTICLE URL:
//   1. Find the day entry below by its `day` number.
//   2. Set `substackUrl` to the full URL of your published Substack article.
//   3. Optionally set `githubUrl` to a link to related code or a repo.
//   4. Set `published: true` once the article is live.
//   5. Run `npm run build` and redeploy (e.g., push to GitHub Pages).
//
// Visitors CANNOT modify this file — it is compiled into the static site.
// ─────────────────────────────────────────────────────────────────────────────

export type DayStatus = 'not-started' | 'in-progress' | 'completed'

export interface ResourceLink {
  title: string
  url: string
  type: 'docs' | 'tutorial' | 'video' | 'repo' | 'article'
}

export interface RoadmapDay {
  day: number
  title: string
  stage: number
  stageName: string
  category: string
  description: string
  objectives: string[]
  concepts: string[]
  estimatedMinutes: number
  tasks: string[]
  reflectionQuestion: string
  resources: ResourceLink[]
  lessonBody?: string       // Optional Markdown body: the full lesson explanation
  substackUrl?: string      // Set when article is published
  githubUrl?: string        // Set when code is available
  published: boolean        // true once the Substack article is live
}


export const stages: { number: number; name: string; days: number[] }[] = [
  { number: 1, name: 'Python Foundations',          days: [1, 2, 3, 4, 5, 6, 7] },
  { number: 2, name: 'Working with Data',            days: [8, 9, 10, 11, 12, 13, 14] },
  { number: 3, name: 'Mathematics for AI',           days: [15, 16, 17, 18, 19, 20, 21] },
  { number: 4, name: 'Machine Learning Fundamentals',days: [22, 23, 24, 25, 26, 27, 28] },
  { number: 5, name: 'Practical Machine Learning',   days: [29, 30, 31, 32, 33, 34, 35] },
  { number: 6, name: 'Reliable Machine Learning',   days: [36, 37, 38, 39, 40, 41, 42] },
  { number: 7, name: 'Deep Learning',               days: [43, 44, 45, 46, 47, 48, 49] },
  { number: 8, name: 'NLP and Transformers',        days: [50, 51, 52, 53, 54, 55, 56] },
  { number: 9, name: 'LLMs and Generative AI',      days: [57, 58, 59, 60, 61, 62, 63] },
  { number: 10, name: 'Deployment and Capstone',    days: [64, 65, 66, 67, 68, 69, 70] },
]

export const roadmap: RoadmapDay[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 1 — PYTHON FOUNDATIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 1,
    title: 'What Does an AI Engineer Actually Do?',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Career & Orientation',
    description:
      'Before writing a single line of code, understand the landscape. What is the difference between a data scientist, an ML engineer, and an AI engineer? What does the day-to-day look like, and what skills actually matter?',
    objectives: [
      'Distinguish AI engineering from data science and ML engineering',
      'Identify the core technical skills an AI engineer needs',
      'Understand what a realistic 70-day learning path looks like',
      'Set up a clear intention and daily routine for the challenge',
    ],
    concepts: ['AI vs. ML vs. data science roles', 'The AI engineer skill stack', 'Learning in public', 'Deliberate practice'],
    estimatedMinutes: 60,
    tasks: [
      'Read about the AI engineering landscape and write a one-paragraph summary in your own words',
      'List five tasks you imagine an AI engineer doing in a typical week',
      'Set up a simple learning log — a text file or notebook — where you will record daily reflections',
      'Write a personal "why" statement: why are you starting this challenge today?',
    ],
    reflectionQuestion: 'What does success look like for you at the end of 70 days? Write it down specifically.',
    resources: [
      { title: 'What Is AI Engineering? — Chip Huyen', url: 'https://huyenchip.com/2023/06/07/generative-ai-strategy.html', type: 'article' },
      { title: 'AI Engineer vs. ML Engineer vs. Data Scientist', url: 'https://www.deeplearning.ai/blog/', type: 'article' },
      { title: 'Roadmap.sh — AI Engineer Roadmap', url: 'https://roadmap.sh/ai-engineer', type: 'docs' },
    ],
    substackUrl: 'https://likitha3126.substack.com/p/day-170-okay-im-actually-starting?r=8xcaev',
    published: true,
    lessonBody: `## What is AI Engineering?

AI engineering is the discipline of building, deploying, and maintaining systems that use artificial intelligence to solve real problems. It sits at the intersection of software engineering and machine learning — but it is not the same as either.

Here is a useful way to think about the three related roles:

| Role | Primary focus | Core skill |
|------|--------------|-----------|
| **Data scientist** | Discovering insights from data | Statistics, visualisation, modelling |
| **ML engineer** | Training and evaluating ML models | Algorithm selection, training pipelines |
| **AI engineer** | Integrating models into products | APIs, orchestration, LLMs, deployment |

The AI engineer role grew rapidly with the rise of large language models (LLMs). Instead of training a model from scratch — which requires enormous compute and data — AI engineers combine existing foundation models with retrieval systems, prompting strategies, and product-quality software. They make AI useful.

## Why this matters

Understanding where you are headed makes every subsequent day of learning more purposeful. Knowing that AI engineers need Python, data manipulation skills, ML fundamentals, deep learning, NLP, and deployment experience tells you exactly why this 70-day roadmap is structured the way it is.

Each stage builds on the previous one:

1. **Python** — the language used across the entire AI stack.
2. **Data** — AI is data; you must understand how to handle it.
3. **Mathematics** — the intuition behind the algorithms you will use.
4. **Machine learning** — supervised learning, the backbone of most AI systems.
5. **Deep learning** — neural networks that power modern perception and language.
6. **NLP and Transformers** — the architecture behind modern LLMs.
7. **LLMs and RAG** — building with foundation models.
8. **Deployment** — making everything production-ready.

## Common misconceptions

**"AI engineers need a PhD."**
Not necessarily. Many working AI engineers are self-taught or have a computer science background. What matters is demonstrated ability to build real systems.

**"You need to train your own models."**
Most AI engineers primarily work with pretrained models and focus on fine-tuning, prompting, retrieval, and evaluation rather than training from scratch.

**"AI is just Python scripts."**
AI engineering involves system design, API development, security, cost management, latency optimisation, and reliability engineering. It is full-stack work.

## Your learning log

Starting today, keep a daily learning log. This can be as simple as a plain text file. Each entry should answer three questions:

1. What did I actually learn today?
2. What is still confusing?
3. What will I revisit tomorrow?

Writing consolidates learning. This practice alone will make the 70-day challenge dramatically more effective. Use the **Personal Notes** section below every day to capture your thinking.`,
  },
  {
    day: 2,
    title: 'Setting Up Python, VS Code and Jupyter Notebooks',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Environment Setup',
    description:
      'A reliable, well-configured development environment removes friction from learning. Today you set up Python, configure VS Code with the right extensions, and run your first Jupyter notebook.',
    objectives: [
      'Install Python 3.11+ and verify the installation',
      'Configure VS Code with Python and Jupyter extensions',
      'Create and activate a virtual environment',
      'Run and navigate a Jupyter notebook successfully',
    ],
    concepts: ['Python interpreter', 'Virtual environments', 'pip and package management', 'Jupyter kernels', 'REPL'],
    estimatedMinutes: 90,
    tasks: [
      'Install Python from python.org and confirm `python --version` works in your terminal',
      'Install VS Code and the Python, Pylance, and Jupyter extensions',
      'Create a project folder, set up a virtual environment with `python -m venv venv`, and activate it',
      'Install Jupyter with `pip install jupyter` and launch `jupyter notebook`',
      'Write a notebook cell that prints "Day 2 — environment ready" and run it',
    ],
    reflectionQuestion: 'What was the trickiest part of setting up your environment, and how did you solve it?',
    resources: [
      { title: 'Python Downloads', url: 'https://www.python.org/downloads/', type: 'docs' },
      { title: 'VS Code Python Tutorial', url: 'https://code.visualstudio.com/docs/python/python-tutorial', type: 'tutorial' },
      { title: 'Jupyter Quickstart', url: 'https://jupyter.readthedocs.io/en/latest/running.html', type: 'docs' },
    ],
    substackUrl: 'https://likitha3126.substack.com/p/before-ai-i-need-to-set-up-my-python?r=8xcaev',
    published: true,

  },
  {
    day: 3,
    title: 'Python Data Types, Control Flow and Collections',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Core Python',
    description:
      'Python\'s built-in data structures and control flow statements form the backbone of every AI script you will write. Today you master integers, floats, strings, booleans, lists, tuples, dictionaries, sets, and how to control program flow.',
    objectives: [
      'Use Python\'s numeric, string, and boolean types confidently',
      'Create and manipulate lists, tuples, dictionaries, and sets',
      'Write `if/elif/else`, `for`, and `while` control structures',
      'Apply list comprehensions for concise iteration',
    ],
    concepts: ['Dynamic typing', 'Mutability', 'Indexing and slicing', 'Dictionary lookups', 'Comprehensions'],
    estimatedMinutes: 120,
    tasks: [
      'Create a list of ten numbers and compute the mean using only built-in Python (no libraries)',
      'Build a dictionary representing a dataset entry with at least five fields',
      'Write a loop that iterates over the dictionary and prints each key-value pair formatted as "Key: Value"',
      'Use a list comprehension to filter only even numbers from a list of 1–20',
      'Write a function that counts word frequencies in a sentence using a dictionary',
    ],
    reflectionQuestion: 'How do Python\'s mutable vs. immutable types affect the code you write? Give a concrete example.',
    resources: [
      { title: 'Python Official Tutorial — Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html', type: 'docs' },
      { title: 'Real Python — Strings and Character Data', url: 'https://realpython.com/python-strings/', type: 'tutorial' },
    ],
    substackUrl: '[https://substack.com/@likitha3126/note/p-222683362?utm_source=notes-share-action&r=8xcaev](https://substack.com/@likitha3126/note/p-222683362?utm_source=notes-share-action\&r=8xcaev)',
    published: true,
  },
  {
    day: 4,
    title: 'Functions, Modules and Reusable Code',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Core Python',
    description:
      'Good AI code is modular, testable, and reusable. Today you learn to write well-named functions, use default arguments and type hints, organise code into modules, and import from the standard library.',
    objectives: [
      'Write functions with clear signatures, docstrings, and type hints',
      'Use default arguments, *args, and **kwargs appropriately',
      'Organize code into Python modules and import correctly',
      'Use at least three useful standard library modules',
    ],
    concepts: ['Function scope', 'Type annotations', 'Docstrings', 'Module system', 'Standard library'],
    estimatedMinutes: 120,
    tasks: [
      'Refactor yesterday\'s word-frequency script into a module with a clean `count_words(text: str) -> dict[str, int]` function',
      'Add type hints and a docstring to every function you write today',
      'Write a script that uses `pathlib`, `datetime`, and `collections` from the standard library',
      'Create a small module with three utility functions and import them in a separate script',
    ],
    reflectionQuestion: 'What is the difference between a function\'s parameters and its arguments? Why does this distinction matter?',
    resources: [
      { title: 'Python Docs — Defining Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', type: 'docs' },
      { title: 'Python Docs — Modules', url: 'https://docs.python.org/3/tutorial/modules.html', type: 'docs' },
      { title: 'Real Python — Type Hints', url: 'https://realpython.com/python-type-checking/', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 5,
    title: 'Files, Exceptions and Debugging',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Core Python',
    description:
      'AI pipelines read data from files and must handle failures gracefully. Today you learn file I/O with context managers, exception handling, and how to use VS Code\'s debugger effectively.',
    objectives: [
      'Read and write text and CSV files using `open()` and `pathlib`',
      'Parse a JSON file and access nested values',
      'Handle exceptions with `try/except/finally` blocks',
      'Use the VS Code debugger to set breakpoints and inspect variables',
    ],
    concepts: ['Context managers', 'Exception hierarchy', 'File modes', 'JSON parsing', 'Debugging workflow'],
    estimatedMinutes: 120,
    tasks: [
      'Read a CSV file line by line and print a summary: total rows, column names',
      'Write a function that safely reads a JSON file and returns a default value if the file is missing or malformed',
      'Intentionally raise and catch three different exception types in a script',
      'Set a breakpoint in VS Code and step through a function to inspect its variables at each step',
    ],
    reflectionQuestion: 'When should you catch a specific exception type versus catching the broad `Exception` base class?',
    resources: [
      { title: 'Python Docs — Errors and Exceptions', url: 'https://docs.python.org/3/tutorial/errors.html', type: 'docs' },
      { title: 'Python Docs — Reading and Writing Files', url: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files', type: 'docs' },
      { title: 'VS Code Python Debugging', url: 'https://code.visualstudio.com/docs/python/debugging', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 6,
    title: 'Object-Oriented Programming Essentials',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Core Python',
    description:
      'Many AI libraries — PyTorch, scikit-learn, Transformers — are class-based. Understanding OOP lets you read their source, extend their behaviour, and structure your own code well.',
    objectives: [
      'Define classes with `__init__`, instance methods, and properties',
      'Understand inheritance and method overriding',
      'Use dunder (magic) methods: `__repr__`, `__str__`, `__len__`',
      'Recognise when OOP is and is not the right tool',
    ],
    concepts: ['Classes vs. instances', 'Inheritance chain', 'Encapsulation', 'Polymorphism', 'Dunder methods'],
    estimatedMinutes: 120,
    tasks: [
      'Model a simple `Dataset` class with attributes for name, size, and feature columns',
      'Add a method `summary()` that prints a formatted description of the dataset',
      'Create a `LabelledDataset` subclass that extends `Dataset` with a `labels` attribute',
      'Implement `__len__` so that `len(dataset)` returns the number of rows',
      'Write `__repr__` so that `print(dataset)` shows something meaningful',
    ],
    reflectionQuestion: 'What is the difference between `__str__` and `__repr__`? Which would you use in a data-processing library?',
    resources: [
      { title: 'Python Docs — Classes', url: 'https://docs.python.org/3/tutorial/classes.html', type: 'docs' },
      { title: 'Real Python — OOP in Python', url: 'https://realpython.com/python3-object-oriented-programming/', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 7,
    title: 'Git, GitHub and Documenting the First Week',
    stage: 1,
    stageName: 'Python Foundations',
    category: 'Tooling',
    description:
      'Version control is a professional requirement. Today you set up Git, create a public learning repository, write a proper README, and commit everything from the first week into a coherent project.',
    objectives: [
      'Initialise a Git repository and understand the staging area',
      'Write clear, descriptive commit messages',
      'Push code to GitHub and set up a learning repository',
      'Write a README that explains what the repo contains',
    ],
    concepts: ['Git workflow: add, commit, push', 'Branches and merge', 'GitHub remote', 'README conventions', '.gitignore'],
    estimatedMinutes: 90,
    tasks: [
      'Install Git and confirm `git --version` works',
      'Initialise a repo for this learning journey and push it to GitHub',
      'Commit all exercises from Days 1–6 with clear, descriptive messages',
      'Write a README explaining what the repo is, how it is organised, and what you plan to add',
      'Add a `.gitignore` that excludes `venv/`, `__pycache__/`, `.ipynb_checkpoints/`',
    ],
    reflectionQuestion: 'Why is version control essential for AI projects rather than just saving files? What would go wrong without it?',
    resources: [
      { title: 'Git — The Official Documentation', url: 'https://git-scm.com/doc', type: 'docs' },
      { title: 'GitHub Quickstart', url: 'https://docs.github.com/en/get-started/quickstart', type: 'tutorial' },
      { title: 'How to Write a Good README', url: 'https://www.makeareadme.com/', type: 'tutorial' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 2 — WORKING WITH DATA
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 8,
    title: 'NumPy Arrays and Vectorized Computation',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Data Engineering',
    description:
      'NumPy is the foundation of numerical computing in Python. Its ndarray enables vectorized operations that run orders of magnitude faster than Python loops. Almost every scientific library builds on NumPy.',
    objectives: [
      'Create NumPy arrays from lists and with built-in functions',
      'Perform arithmetic on arrays without explicit loops',
      'Understand how NumPy achieves its speed through C-backed operations',
      'Use universal functions (ufuncs) for element-wise computation',
    ],
    concepts: ['ndarray', 'Vectorization', 'dtype', 'ufuncs', 'Memory layout'],
    estimatedMinutes: 120,
    tasks: [
      'Create a 1-D array of 100 evenly-spaced values between 0 and 10 using `np.linspace`',
      'Compute the mean, standard deviation, min, and max without a loop',
      'Create a 2-D array (matrix) of shape (4, 5) filled with random floats',
      'Benchmark a Python loop vs. NumPy vectorized operation on an array of 1 million elements',
    ],
    reflectionQuestion: 'Why does vectorized computation outperform Python loops? What makes this critical for AI workloads?',
    resources: [
      { title: 'NumPy Official Docs', url: 'https://numpy.org/doc/stable/', type: 'docs' },
      { title: 'NumPy Quickstart Tutorial', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 9,
    title: 'Array Shapes, Indexing and Broadcasting',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Data Engineering',
    description:
      'Understanding array shapes, strides, and broadcasting is what separates confident NumPy users from confused ones. These concepts reappear constantly in deep learning with tensor shapes.',
    objectives: [
      'Explain shape, rank, and the difference between 1-D and 2-D arrays',
      'Use fancy indexing and boolean masking to select data',
      'Apply broadcasting rules to operate on arrays of different shapes',
      'Reshape and transpose arrays correctly',
    ],
    concepts: ['Shape and rank', 'Axis parameter', 'Fancy indexing', 'Boolean masking', 'Broadcasting rules'],
    estimatedMinutes: 120,
    tasks: [
      'Create a (3, 4) matrix and access its second row, third column, and the top-right 2×2 submatrix',
      'Use a boolean mask to filter elements greater than 0.5 from a random array',
      'Add a (1, 4) row vector to a (3, 4) matrix using broadcasting and verify the result',
      'Reshape a (12,) array into (3, 4) and then into (2, 2, 3)',
    ],
    reflectionQuestion: 'How do NumPy\'s broadcasting rules help you avoid writing explicit loops? Give a real example.',
    resources: [
      { title: 'NumPy Indexing', url: 'https://numpy.org/doc/stable/user/basics.indexing.html', type: 'docs' },
      { title: 'NumPy Broadcasting', url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 10,
    title: 'Pandas Series and DataFrames',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Data Engineering',
    description:
      'Pandas is the industry-standard tool for tabular data manipulation. Every AI project starts with data, and Pandas is how you load, inspect, filter, and reshape it before training a model.',
    objectives: [
      'Create Series and DataFrames from dictionaries and CSV files',
      'Select columns and rows with `.loc` and `.iloc`',
      'Sort, filter, and group data',
      'Compute summary statistics on a real dataset',
    ],
    concepts: ['Series vs. DataFrame', 'Index alignment', 'loc vs. iloc', 'GroupBy', 'Method chaining'],
    estimatedMinutes: 120,
    tasks: [
      'Load the Iris or Titanic CSV into a DataFrame using `pd.read_csv()`',
      'Display the first 10 rows, the shape, data types, and basic statistics with `.describe()`',
      'Select all rows where a numeric column exceeds its mean',
      'Group the data by a categorical column and compute the mean of a numeric column per group',
    ],
    reflectionQuestion: 'What are the risks of using `.iloc` vs. `.loc` when you reshape or reindex a DataFrame?',
    resources: [
      { title: 'Pandas Getting Started', url: 'https://pandas.pydata.org/docs/getting_started/index.html', type: 'docs' },
      { title: 'Pandas User Guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 11,
    title: 'Cleaning Missing, Duplicate and Inconsistent Data',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Data Engineering',
    description:
      'Real-world data is messy. Missing values, duplicates, inconsistent casing, outliers, and mixed types cause model failures. Cleaning data before analysis is always the unglamorous but critical first step.',
    objectives: [
      'Detect and handle missing values with `.isna()`, `.fillna()`, `.dropna()`',
      'Remove duplicate rows and understand why they appear',
      'Standardize string columns (casing, whitespace, encoding)',
      'Identify and handle outliers using statistical methods',
    ],
    concepts: ['Missing data patterns', 'Imputation strategies', 'Data type coercion', 'Outlier detection', 'Data quality checklist'],
    estimatedMinutes: 120,
    tasks: [
      'Load a messy dataset and produce a report: percentage of missing values per column',
      'Fill numeric missing values with the column median and categorical missing values with "Unknown"',
      'Find and drop all duplicate rows, reporting how many were removed',
      'Normalize a string column: strip whitespace and convert to lowercase',
    ],
    reflectionQuestion: 'When is it better to drop rows with missing values rather than imputing them?',
    resources: [
      { title: 'Pandas — Working with Missing Data', url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html', type: 'docs' },
      { title: 'Kaggle — Data Cleaning Course', url: 'https://www.kaggle.com/learn/data-cleaning', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 12,
    title: 'Exploratory Data Analysis',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Data Engineering',
    description:
      'Before modelling, you must understand your data deeply. EDA surfaces patterns, relationships, and anomalies that shape all modelling decisions. Skipping EDA is one of the most common mistakes beginners make.',
    objectives: [
      'Identify distributions of numeric and categorical variables',
      'Find correlations between variables and interpret their meaning',
      'Spot potential data quality issues through inspection',
      'Formulate hypotheses from exploratory findings',
    ],
    concepts: ['Distribution analysis', 'Correlation matrix', 'Cross-tabulation', 'Skewness and kurtosis', 'Hypothesis generation'],
    estimatedMinutes: 120,
    tasks: [
      'Compute a full correlation matrix and identify the three strongest positive and negative correlations',
      'Plot histograms for every numeric column and describe the distribution (normal, skewed, bimodal)',
      'Create a cross-tabulation between two categorical variables',
      'Write a short narrative (3–5 sentences) summarising your key EDA findings from today\'s dataset',
    ],
    reflectionQuestion: 'What assumptions would you make going into modelling, and what would invalidate them?',
    resources: [
      { title: 'Pandas — Exploratory Data Analysis', url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/06_calculate_statistics.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 13,
    title: 'Data Visualization with Matplotlib',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Data Engineering',
    description:
      'Matplotlib is the foundational visualization library in Python. Learning to produce clear, well-labelled charts is an essential communication skill for an AI engineer presenting results to stakeholders.',
    objectives: [
      'Create line plots, bar charts, scatter plots, and histograms',
      'Customize titles, axis labels, legends, and color palettes',
      'Create multi-panel figures with `plt.subplots()`',
      'Save publication-quality figures to file',
    ],
    concepts: ['Figure and Axes objects', 'Object-oriented vs. pyplot API', 'Color and style', 'Annotations', 'Figure sizing and DPI'],
    estimatedMinutes: 120,
    tasks: [
      'Create a 2×2 subplot figure showing: histogram, scatter plot, bar chart, and line plot from a dataset',
      'Add a title, axis labels, and legend to each subplot',
      'Create a scatter plot with points colored by a categorical variable',
      'Save the final figure as a 300-DPI PNG',
    ],
    reflectionQuestion: 'What makes a data visualization misleading? Name two ways a chart can deceive without lying.',
    resources: [
      { title: 'Matplotlib Official Tutorials', url: 'https://matplotlib.org/stable/tutorials/index.html', type: 'docs' },
      { title: 'Seaborn Tutorial', url: 'https://seaborn.pydata.org/tutorial.html', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 14,
    title: 'Mini-Project: Investigating a Real Dataset',
    stage: 2,
    stageName: 'Working with Data',
    category: 'Project',
    description:
      'Apply everything from the past week to a complete, self-contained analysis. Choose a public dataset, clean it, explore it thoroughly, and present your findings in a structured Jupyter notebook.',
    objectives: [
      'Conduct a complete data investigation from raw CSV to written findings',
      'Produce clean, reproducible notebook code with narrative text',
      'Practice the full EDA workflow under realistic constraints',
      'Communicate findings clearly with charts and written explanation',
    ],
    concepts: ['End-to-end data analysis', 'Reproducibility', 'Storytelling with data', 'Notebook structure'],
    estimatedMinutes: 180,
    tasks: [
      'Choose a dataset from Kaggle or the UCI Machine Learning Repository',
      'Perform the full cleaning workflow: inspect, handle missing values, remove duplicates',
      'Run EDA: distributions, correlations, and cross-tabulations',
      'Produce at least three charts that together tell a coherent story about the data',
      'Write a conclusion cell: three findings, two questions for further investigation, one limitation',
      'Commit the notebook to your GitHub learning repo',
    ],
    reflectionQuestion: 'What surprised you most about this dataset? What would you investigate next given more time?',
    resources: [
      { title: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets', type: 'repo' },
      { title: 'UCI ML Repository', url: 'https://archive.ics.uci.edu/datasets', type: 'repo' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 3 — MATHEMATICS FOR AI
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 15,
    title: 'Vectors and Scalars in Machine Learning',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Linear Algebra',
    description:
      'Vectors are everywhere in AI: feature vectors, weight vectors, embeddings. A scalar is a single number; a vector is a directed list of numbers. Understanding their geometry gives intuition for why models learn what they learn.',
    objectives: [
      'Define scalars, vectors, and understand their geometric meaning',
      'Compute dot products and understand what they measure',
      'Implement vector operations using NumPy',
      'Interpret cosine similarity as a measure of vector direction',
    ],
    concepts: ['Vector magnitude', 'Direction', 'Dot product', 'Unit vectors', 'Cosine similarity'],
    estimatedMinutes: 120,
    tasks: [
      'Represent five data points as 3-D feature vectors and compute their magnitudes',
      'Compute the dot product of two vectors manually, then verify with NumPy',
      'Implement cosine similarity from scratch and test it on three vector pairs',
      'Visualize two 2-D vectors and their dot product geometrically using Matplotlib',
    ],
    reflectionQuestion: 'What does a dot product of zero between two vectors mean geometrically?',
    resources: [
      { title: '3Blue1Brown — Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'video' },
      { title: 'Khan Academy — Vectors', url: 'https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 16,
    title: 'Matrices and Matrix Operations',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Linear Algebra',
    description:
      'Matrices are the central data structure of deep learning. Every layer in a neural network performs a matrix multiplication. Understanding matrix operations is non-negotiable for reading model architectures.',
    objectives: [
      'Represent datasets and transformations as matrices',
      'Perform matrix addition, subtraction, and multiplication correctly',
      'Understand the transpose and its role in dot products',
      'Recognize the identity matrix and matrix inverse',
    ],
    concepts: ['Matrix shape and rank', 'Matrix multiplication rules', 'Transpose', 'Identity matrix', 'Invertibility'],
    estimatedMinutes: 120,
    tasks: [
      'Create two (3, 3) matrices and compute their product using NumPy',
      'Verify that A @ A.T produces a symmetric matrix',
      'Implement matrix multiplication from scratch using nested loops, then compare with NumPy',
      'Compute the inverse of a matrix and verify that A @ inv(A) ≈ I',
    ],
    reflectionQuestion: 'Why does the order of matrix multiplication matter? Give an example where A @ B ≠ B @ A.',
    resources: [
      { title: 'NumPy — Linear Algebra', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', type: 'docs' },
      { title: '3Blue1Brown — Matrix Multiplication', url: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'video' },
    ],
    published: false,
  },
  {
    day: 17,
    title: 'Derivatives and the Intuition Behind Change',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Calculus',
    description:
      'Derivatives measure how much a function\'s output changes when its input changes slightly. This concept is the mathematical engine of learning: every gradient descent update is a derivative computation.',
    objectives: [
      'Understand what a derivative measures intuitively',
      'Compute simple derivatives by hand and verify numerically',
      'Apply the chain rule to composite functions',
      'Connect derivatives to the slope of a function',
    ],
    concepts: ['Limit definition of derivative', 'Power rule', 'Chain rule', 'Numerical differentiation', 'Slope interpretation'],
    estimatedMinutes: 120,
    tasks: [
      'Compute the derivative of f(x) = x² + 3x − 2 by hand and plot the function and its derivative',
      'Apply the chain rule to f(g(x)) where f(x) = x² and g(x) = 2x + 1',
      'Implement numerical differentiation using the finite difference method',
      'Verify your numerical derivative against the analytical result for three functions',
    ],
    reflectionQuestion: 'Why does setting the derivative equal to zero help us find the minimum of a function?',
    resources: [
      { title: 'Khan Academy — Derivatives', url: 'https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-1-new', type: 'tutorial' },
      { title: '3Blue1Brown — The Essence of Calculus', url: 'https://www.3blue1brown.com/topics/calculus', type: 'video' },
    ],
    published: false,
  },
  {
    day: 18,
    title: 'Gradients and Optimization',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Calculus',
    description:
      'A gradient is the multi-dimensional extension of a derivative — it points in the direction of steepest increase. Gradient descent follows the negative gradient to minimize a loss function, which is exactly what trains a neural network.',
    objectives: [
      'Compute partial derivatives for functions of multiple variables',
      'Understand the gradient as a vector of partial derivatives',
      'Implement gradient descent from scratch on a simple function',
      'Observe how the learning rate affects convergence',
    ],
    concepts: ['Partial derivative', 'Gradient vector', 'Learning rate', 'Convergence', 'Loss landscape'],
    estimatedMinutes: 120,
    tasks: [
      'Compute the gradient of f(x, y) = x² + y² at the point (3, 4)',
      'Implement gradient descent to minimize f(x) = (x − 5)² starting from x=0',
      'Plot the loss over iterations for three different learning rates: 0.01, 0.1, 0.9',
      'Explain in writing what happens when the learning rate is too large',
    ],
    reflectionQuestion: 'What does the gradient tell you, and why does gradient descent move in the negative gradient direction?',
    resources: [
      { title: 'Khan Academy — Multivariable Calculus', url: 'https://www.khanacademy.org/math/multivariable-calculus', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 19,
    title: 'Probability and Conditional Probability',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Statistics',
    description:
      'AI models output probabilities. Understanding how probability works — including Bayes\' theorem and conditional distributions — is essential for interpreting model outputs and designing loss functions.',
    objectives: [
      'Define probability, sample space, and events',
      'Compute conditional probabilities and apply Bayes\' theorem',
      'Understand independence and why it matters for features',
      'Compute joint and marginal probabilities from a table',
    ],
    concepts: ['Sample space', 'Conditional probability', 'Bayes\' theorem', 'Independence', 'Joint vs. marginal probability'],
    estimatedMinutes: 120,
    tasks: [
      'Compute P(A|B) from a 2×2 contingency table using Bayes\' theorem',
      'Simulate coin flips in NumPy and verify the law of large numbers empirically',
      'Write a spam filter sketch using Bayes\' theorem on a toy word-frequency table',
      'Identify two features in a dataset and test whether they are statistically independent',
    ],
    reflectionQuestion: 'How does Bayes\' theorem update our beliefs when we receive new evidence? Give a medical testing example.',
    resources: [
      { title: 'Khan Academy — Statistics and Probability', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 20,
    title: 'Distributions, Mean, Variance and Standard Deviation',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Statistics',
    description:
      'Statistical distributions describe the shape of data and model outputs. Understanding mean, variance, and standard deviation — and common distributions like Normal and Bernoulli — is essential for feature engineering and model design.',
    objectives: [
      'Compute mean, median, variance, and standard deviation by hand and with NumPy',
      'Understand the Normal distribution and the 68–95–99.7 rule',
      'Recognize common distributions: Bernoulli, Binomial, Uniform, Poisson',
      'Connect standard deviation to model uncertainty',
    ],
    concepts: ['Central tendency', 'Spread and variance', 'Normal distribution', 'Z-score', 'PDF vs. PMF'],
    estimatedMinutes: 120,
    tasks: [
      'Generate 10,000 samples from a Normal distribution and verify mean ≈ μ and std ≈ σ empirically',
      'Plot the Normal PDF alongside a histogram of the samples',
      'Compute z-scores for a dataset and identify values more than 2 standard deviations from the mean',
      'Compare histograms for Normal, Uniform, and Binomial distributions side by side',
    ],
    reflectionQuestion: 'Why does the Central Limit Theorem matter for machine learning, even when individual data points are not normally distributed?',
    resources: [
      { title: 'NumPy Random Distributions', url: 'https://numpy.org/doc/stable/reference/random/generator.html', type: 'docs' },
      { title: 'StatQuest — Normal Distribution', url: 'https://statquest.org/', type: 'video' },
    ],
    published: false,
  },
  {
    day: 21,
    title: 'Correlation, Sampling and Statistical Reasoning',
    stage: 3,
    stageName: 'Mathematics for AI',
    category: 'Statistics',
    description:
      'Correlation measures linear relationships between variables, but does not imply causation. Sampling strategy determines whether your model generalises. Statistical reasoning separates signal from noise.',
    objectives: [
      'Compute Pearson and Spearman correlation coefficients',
      'Distinguish correlation from causation with concrete examples',
      'Understand random sampling, stratified sampling, and bias',
      'Apply hypothesis testing intuition to model evaluation',
    ],
    concepts: ['Pearson correlation', 'Spearman correlation', 'Causation vs. correlation', 'Sampling bias', 'Statistical significance'],
    estimatedMinutes: 120,
    tasks: [
      'Compute correlations between all pairs of numeric features in a dataset',
      'Find and describe one pair that is correlated but likely not causally related',
      'Generate a stratified sample from an imbalanced dataset ensuring each class is represented proportionally',
      'Explain in writing: what is a p-value and why is p < 0.05 not a magic threshold?',
    ],
    reflectionQuestion: 'A model trained on hospital data performs poorly in clinics. What sampling issue explains this?',
    resources: [
      { title: 'Pandas — Correlation', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html', type: 'docs' },
      { title: 'StatQuest — P-values', url: 'https://statquest.org/', type: 'video' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 4 — MACHINE LEARNING FUNDAMENTALS
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 22,
    title: 'AI vs. Machine Learning vs. Deep Learning',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Foundations',
    description:
      'The terms AI, machine learning, and deep learning are frequently misused. Today you build a precise mental model of how these fields relate, what each approach is good at, and when not to use a neural network.',
    objectives: [
      'Define AI, machine learning, and deep learning precisely',
      'Explain the hierarchical relationship between these fields',
      'Choose the right approach for a given problem type',
      'Identify the key assumptions of each paradigm',
    ],
    concepts: ['Symbolic AI vs. statistical AI', 'Feature engineering vs. representation learning', 'Data requirements', 'Compute trade-offs'],
    estimatedMinutes: 90,
    tasks: [
      'Draw a Venn diagram showing AI ⊃ ML ⊃ DL and annotate each region with examples',
      'Find three real-world problems where classical ML is preferable to deep learning',
      'Write a one-paragraph explanation of machine learning suitable for a non-technical colleague',
      'List five ML use cases that have become products you personally use',
    ],
    reflectionQuestion: 'When is a simple rule-based system better than a machine learning model?',
    resources: [
      { title: 'Google ML Crash Course — Introduction', url: 'https://developers.google.com/machine-learning/crash-course/ml-intro', type: 'tutorial' },
      { title: 'fast.ai — Practical Deep Learning Introduction', url: 'https://course.fast.ai/', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 23,
    title: 'Supervised vs. Unsupervised Learning',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Foundations',
    description:
      'The majority of practical machine learning is supervised: you provide labelled examples, and the model learns to predict labels for new inputs. Unsupervised learning finds structure in data without labels.',
    objectives: [
      'Define supervised, unsupervised, and semi-supervised learning',
      'Match real problems to the correct learning paradigm',
      'Understand the role of labels and why they are expensive',
      'Identify reinforcement learning as a distinct paradigm',
    ],
    concepts: ['Labels and supervision signal', 'Classification vs. regression', 'Clustering', 'Dimensionality reduction', 'Self-supervised learning'],
    estimatedMinutes: 90,
    tasks: [
      'Categorize ten real-world problems as supervised, unsupervised, or reinforcement learning',
      'Find and load a labelled dataset (e.g., Iris) and inspect its feature-label structure',
      'Write a description of what a K-Means algorithm does using only plain English — no equations',
      'Identify one area where acquiring labels is prohibitively expensive and describe an alternative approach',
    ],
    reflectionQuestion: 'What are the trade-offs between supervised and self-supervised learning for language models?',
    resources: [
      { title: 'Scikit-learn — Choosing the Right Estimator', url: 'https://scikit-learn.org/stable/tutorial/machine_learning_map/index.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 24,
    title: 'Features, Labels and Datasets',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Foundations',
    description:
      'Everything in supervised ML depends on the quality of your features and labels. Understanding what makes a good feature, how label noise affects models, and how to structure a dataset correctly sets the foundation for everything that follows.',
    objectives: [
      'Define features, labels, and instances in precise ML vocabulary',
      'Distinguish numeric, categorical, ordinal, and binary features',
      'Understand label noise and its effects on model training',
      'Structure a dataset correctly: each row is one instance',
    ],
    concepts: ['Feature matrix X', 'Target vector y', 'Numeric vs. categorical features', 'Label noise', 'Data leakage'],
    estimatedMinutes: 120,
    tasks: [
      'Take any dataset and rename its columns to X_1, X_2, …, y to reinforce the feature-label structure',
      'Identify which columns are numeric, categorical, ordinal, and binary',
      'Introduce 5% label noise into a clean dataset and note how it changes summary statistics',
      'Explain data leakage in writing: what is it, and how does it produce falsely optimistic results?',
    ],
    reflectionQuestion: 'What is the difference between a feature and a label, and can a column be both in different contexts?',
    resources: [
      { title: 'Scikit-learn — Dataset Transformations', url: 'https://scikit-learn.org/stable/data_transforms.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 25,
    title: 'Training, Validation and Test Sets',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Foundations',
    description:
      'The train/validation/test split is one of the most important — and most abused — ideas in machine learning. Understanding why we need three separate sets, how to split correctly, and what each set is for prevents the majority of evaluation mistakes.',
    objectives: [
      'Explain the purpose of each split and the risk of conflating them',
      'Implement a stratified train/validation/test split',
      'Understand why the test set must be touched only once',
      'Identify data leakage across splits',
    ],
    concepts: ['Train/val/test split', 'Stratification', 'Holdout evaluation', 'Data leakage', 'Temporal splits'],
    estimatedMinutes: 120,
    tasks: [
      'Split a dataset 70/15/15 using scikit-learn\'s `train_test_split` with a fixed random seed',
      'Verify that the class distribution is preserved across all three splits (stratified)',
      'Explain in writing: what happens if you tune hyperparameters on the test set?',
      'Find a public Kaggle discussion where test set leakage corrupted a competition leaderboard',
    ],
    reflectionQuestion: 'Why should you never make decisions about your model based on its test set performance until the very end?',
    resources: [
      { title: 'Scikit-learn — Cross-Validation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 26,
    title: 'Linear Regression',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Supervised Learning',
    description:
      'Linear regression is the simplest and most interpretable predictive model. Understanding its assumptions, how it finds the best-fit line through least squares, and how to evaluate its performance gives you a solid foundation for all regression tasks.',
    objectives: [
      'Implement simple and multiple linear regression with scikit-learn',
      'Understand the least squares objective and coefficient interpretation',
      'Evaluate regression with MSE, RMSE, MAE, and R²',
      'Visualize the residuals and check regression assumptions',
    ],
    concepts: ['Regression vs. classification', 'Coefficients and intercept', 'Least squares', 'Residuals', 'R² score'],
    estimatedMinutes: 120,
    tasks: [
      'Fit a `LinearRegression` model on the California housing dataset',
      'Print and interpret each feature\'s coefficient',
      'Plot predicted vs. actual values on the test set',
      'Plot the residuals and check whether they appear randomly distributed around zero',
    ],
    reflectionQuestion: 'What do the coefficients of a linear regression model tell you, and when are they not interpretable?',
    resources: [
      { title: 'Scikit-learn — Linear Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html', type: 'docs' },
      { title: 'StatQuest — Linear Regression', url: 'https://statquest.org/', type: 'video' },
    ],
    published: false,
  },
  {
    day: 27,
    title: 'Logistic Regression and Classification',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Supervised Learning',
    description:
      'Logistic regression extends linear models to binary classification by applying a sigmoid function to produce class probabilities. Despite its name, it is a classification algorithm — and it remains one of the most widely used in production.',
    objectives: [
      'Understand the sigmoid function and why it produces probabilities',
      'Fit a logistic regression classifier on a binary classification problem',
      'Interpret the decision boundary and class probabilities',
      'Evaluate classification with accuracy, precision, recall, and the confusion matrix',
    ],
    concepts: ['Sigmoid function', 'Log-odds', 'Decision threshold', 'Softmax for multiclass', 'Cross-entropy loss'],
    estimatedMinutes: 120,
    tasks: [
      'Fit a `LogisticRegression` model on the Breast Cancer dataset from scikit-learn',
      'Predict probabilities and plot a histogram of the predicted probability distribution',
      'Compute and display the confusion matrix',
      'Change the decision threshold from 0.5 to 0.3 and observe how precision and recall change',
    ],
    reflectionQuestion: 'Why would you lower the decision threshold in a medical screening application?',
    resources: [
      { title: 'Scikit-learn — Logistic Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 28,
    title: 'Accuracy, Precision, Recall, F1 and Confusion Matrices',
    stage: 4,
    stageName: 'Machine Learning Fundamentals',
    category: 'Evaluation',
    description:
      'Accuracy is often a misleading metric, especially for imbalanced classes. Understanding precision, recall, F1, and the confusion matrix in depth gives you the vocabulary to evaluate models honestly and communicate their limitations.',
    objectives: [
      'Compute TP, TN, FP, FN from a confusion matrix',
      'Calculate precision, recall, and F1 from first principles',
      'Understand when each metric is the right choice',
      'Plot and read an ROC curve and AUC score',
    ],
    concepts: ['Confusion matrix', 'Precision vs. recall trade-off', 'F1 harmonic mean', 'ROC curve', 'AUC-ROC'],
    estimatedMinutes: 120,
    tasks: [
      'Compute precision, recall, and F1 by hand from a given confusion matrix without using scikit-learn',
      'Use scikit-learn to generate a full classification report on the Breast Cancer dataset',
      'Plot the ROC curve and mark the operating point corresponding to the default 0.5 threshold',
      'Explain in writing: for a fraud detection system, which metric matters most and why?',
    ],
    reflectionQuestion: 'A model achieves 99% accuracy on a dataset where 99% of examples are negative. Is this a good model?',
    resources: [
      { title: 'Scikit-learn — Model Evaluation', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html', type: 'docs' },
      { title: 'StatQuest — ROC and AUC', url: 'https://statquest.org/', type: 'video' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 5 — PRACTICAL MACHINE LEARNING
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 29,
    title: 'Decision Trees',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Supervised Learning',
    description:
      'Decision trees split data by the feature that provides the most information gain. They are interpretable, require minimal preprocessing, and form the base learner for powerful ensemble methods like random forests.',
    objectives: [
      'Understand how decision trees split on features using information gain or Gini impurity',
      'Train a decision tree classifier and visualize its structure',
      'Identify how tree depth affects bias and variance',
      'Explain a tree prediction to a non-technical stakeholder',
    ],
    concepts: ['Information gain', 'Gini impurity', 'Tree depth', 'Leaf nodes', 'Pruning'],
    estimatedMinutes: 120,
    tasks: [
      'Train a `DecisionTreeClassifier` on the Iris dataset with `max_depth=3`',
      'Visualize the tree using `sklearn.tree.plot_tree` and annotate which feature is most important',
      'Experiment with depths 1, 3, 5, and 10 — compare training vs. validation accuracy',
      'Compute and plot feature importances from the trained tree',
    ],
    reflectionQuestion: 'At what tree depth does overfitting become visible in your experiment? What does this tell you about model complexity?',
    resources: [
      { title: 'Scikit-learn — Decision Trees', url: 'https://scikit-learn.org/stable/modules/tree.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 30,
    title: 'Random Forests and Ensemble Learning',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Supervised Learning',
    description:
      'Random forests combine many diverse decision trees through bagging and feature randomisation. Ensembles reduce variance without significantly increasing bias, making random forests one of the most reliable and widely-used ML algorithms.',
    objectives: [
      'Explain bagging and why combining weak learners reduces variance',
      'Train a `RandomForestClassifier` and compare it to a single decision tree',
      'Interpret feature importances from an ensemble model',
      'Understand the difference between bagging and boosting',
    ],
    concepts: ['Bagging', 'Feature randomisation', 'Out-of-bag estimation', 'Ensemble diversity', 'Gradient boosting'],
    estimatedMinutes: 120,
    tasks: [
      'Train a random forest on the same dataset from Day 29 and compare its accuracy to the single tree',
      'Plot the feature importances from the random forest',
      'Tune `n_estimators` and observe how performance changes with more trees',
      'Explain to a colleague in writing: why does averaging many imperfect trees beat one perfect-looking tree?',
    ],
    reflectionQuestion: 'Why does a random forest outperform a single decision tree even when each individual tree is not the best it could be?',
    resources: [
      { title: 'Scikit-learn — Random Forests', url: 'https://scikit-learn.org/stable/modules/ensemble.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 31,
    title: 'K-Nearest Neighbors',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Supervised Learning',
    description:
      'K-Nearest Neighbors is one of the most intuitive machine learning algorithms: classify a point by looking at the k most similar training examples. Despite its simplicity, it illustrates key concepts: distance metrics, the bias-variance trade-off, and the curse of dimensionality.',
    objectives: [
      'Implement KNN classification using scikit-learn',
      'Choose k using cross-validation and observe the bias-variance trade-off',
      'Understand how distance metrics affect predictions',
      'Recognize KNN\'s limitations at high dimensionality',
    ],
    concepts: ['Euclidean distance', 'Manhattan distance', 'k selection', 'Curse of dimensionality', 'Non-parametric models'],
    estimatedMinutes: 120,
    tasks: [
      'Train `KNeighborsClassifier` with k=1, 5, 15, and 50 on a 2-D dataset',
      'Plot the decision boundary for each value of k and describe what you observe',
      'Use cross-validation to find the optimal k for the Iris dataset',
      'Explain the curse of dimensionality: why does KNN fail in high dimensions?',
    ],
    reflectionQuestion: 'How does the choice of distance metric change which points are "nearest neighbors"?',
    resources: [
      { title: 'Scikit-learn — KNN', url: 'https://scikit-learn.org/stable/modules/neighbors.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 32,
    title: 'Support Vector Machines',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Supervised Learning',
    description:
      'SVMs find the decision boundary that maximizes the margin between classes. The kernel trick enables SVMs to classify non-linearly separable data by implicitly mapping it to higher dimensions — an elegant and powerful idea.',
    objectives: [
      'Understand the margin and support vectors geometrically',
      'Apply the kernel trick to solve non-linear classification',
      'Train an SVM classifier with different kernels',
      'Tune the C and gamma hyperparameters',
    ],
    concepts: ['Maximum margin classifier', 'Support vectors', 'Kernel trick', 'RBF kernel', 'C and gamma hyperparameters'],
    estimatedMinutes: 120,
    tasks: [
      'Train an SVM with a linear kernel on a two-class subset and visualize the decision boundary',
      'Apply an RBF kernel to non-linearly separable data and compare with the linear result',
      'Run a grid search over C and gamma values and report the best combination',
      'Explain the effect of C: how does increasing C affect the margin and overfitting?',
    ],
    reflectionQuestion: 'What does the kernel function actually compute, and why does it allow SVMs to work in high-dimensional spaces efficiently?',
    resources: [
      { title: 'Scikit-learn — Support Vector Machines', url: 'https://scikit-learn.org/stable/modules/svm.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 33,
    title: 'Clustering with K-Means',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Unsupervised Learning',
    description:
      'K-Means is the most commonly used clustering algorithm. Without labels, it groups data points by minimizing within-cluster variance. It\'s used for customer segmentation, document grouping, anomaly detection, and feature learning.',
    objectives: [
      'Understand the K-Means algorithm: initialization, assignment, update',
      'Choose the number of clusters using the elbow method and silhouette score',
      'Visualize cluster assignments in 2-D',
      'Recognize K-Means\' limitations: spherical clusters, sensitivity to initialization',
    ],
    concepts: ['Centroid', 'Inertia / within-cluster sum of squares', 'Elbow method', 'Silhouette score', 'K-Means++ initialization'],
    estimatedMinutes: 120,
    tasks: [
      'Apply `KMeans` to a 2-D synthetic dataset with 4 true clusters and plot the result',
      'Plot the inertia vs. number of clusters (1–10) and identify the elbow',
      'Compute the silhouette score for k=2, 3, 4, 5, and report which k scores highest',
      'Run K-Means ten times with different random seeds and compare which clusters are found each time',
    ],
    reflectionQuestion: 'K-Means assumes clusters are spherical. What kind of data shapes would break this assumption?',
    resources: [
      { title: 'Scikit-learn — Clustering', url: 'https://scikit-learn.org/stable/modules/clustering.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 34,
    title: 'Scaling, Encoding and Preprocessing Pipelines',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Feature Engineering',
    description:
      'Preprocessing is applied before every model training run. Scikit-learn\'s `Pipeline` and `ColumnTransformer` let you chain preprocessing steps with a model, avoiding data leakage and making your code production-ready.',
    objectives: [
      'Apply StandardScaler, MinMaxScaler, and RobustScaler',
      'Encode categorical variables using OneHotEncoder and OrdinalEncoder',
      'Assemble a full preprocessing pipeline with scikit-learn',
      'Ensure that preprocessing is fit only on training data',
    ],
    concepts: ['Feature scaling', 'One-hot encoding', 'Ordinal encoding', 'Pipeline', 'ColumnTransformer', 'Fit-transform vs. transform'],
    estimatedMinutes: 120,
    tasks: [
      'Scale a numeric dataset with StandardScaler and verify that each column has mean≈0, std≈1',
      'One-hot encode a categorical column and inspect the resulting sparse matrix',
      'Build a `Pipeline` that first scales numeric features, then fits a LogisticRegression model',
      'Use `ColumnTransformer` to apply different transformations to numeric and categorical columns simultaneously',
    ],
    reflectionQuestion: 'Why must you fit the scaler only on training data and not on the full dataset?',
    resources: [
      { title: 'Scikit-learn — Preprocessing', url: 'https://scikit-learn.org/stable/modules/preprocessing.html', type: 'docs' },
      { title: 'Scikit-learn — Pipelines', url: 'https://scikit-learn.org/stable/modules/compose.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 35,
    title: 'Comparing Models and Avoiding Data Leakage',
    stage: 5,
    stageName: 'Practical Machine Learning',
    category: 'Evaluation',
    description:
      'A rigorous model comparison workflow is essential for honest results. Today you build a reusable evaluation framework, compare multiple algorithms on the same dataset, and practice identifying the subtle forms of data leakage that corrupt evaluations.',
    objectives: [
      'Compare five or more models on the same dataset with identical preprocessing',
      'Use stratified k-fold cross-validation for fair comparison',
      'Identify and fix three types of data leakage',
      'Select a model based on multiple criteria, not just accuracy',
    ],
    concepts: ['Baseline model', 'Stratified k-fold', 'Model comparison framework', 'Temporal leakage', 'Target leakage'],
    estimatedMinutes: 150,
    tasks: [
      'Build a function that takes a list of models and returns a comparison table with CV mean and std',
      'Compare: LogisticRegression, DecisionTree, RandomForest, KNN, and SVM on one dataset',
      'Show an example of target leakage: include the target-derived feature and observe the inflated accuracy',
      'Select the winning model and justify the decision in a short written paragraph',
    ],
    reflectionQuestion: 'If two models have similar accuracy but very different inference speeds, how would you decide which one to deploy?',
    resources: [
      { title: 'Scikit-learn — Model Selection', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', type: 'docs' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 6 — RELIABLE MACHINE LEARNING
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 36,
    title: 'Overfitting and Underfitting',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Model Quality',
    description:
      'The most common failure mode in ML is a model that memorises training data instead of learning general patterns. Understanding the bias-variance trade-off and recognising overfitting and underfitting from learning curves is fundamental to building reliable models.',
    objectives: [
      'Explain bias and variance and their sources',
      'Identify overfitting and underfitting from learning curves',
      'Apply simple remedies: more data, simpler model, regularization',
      'Use validation error as the reliable guide to model quality',
    ],
    concepts: ['Bias-variance decomposition', 'Learning curves', 'Training vs. validation gap', 'Generalisation', 'Capacity'],
    estimatedMinutes: 120,
    tasks: [
      'Train a polynomial regression model of degree 1, 5, and 15 and plot training vs. validation error',
      'Generate learning curves for a random forest: show how error changes with training set size',
      'Identify from a chart whether the model is overfitting, underfitting, or well-fitted',
      'Write: three signs of overfitting you would look for in a real project',
    ],
    reflectionQuestion: 'If your model has high training accuracy and low validation accuracy, what are the most likely causes?',
    resources: [
      { title: 'Scikit-learn — Validation Curves', url: 'https://scikit-learn.org/stable/modules/learning_curve.html', type: 'docs' },
      { title: 'StatQuest — Bias and Variance', url: 'https://statquest.org/', type: 'video' },
    ],
    published: false,
  },
  {
    day: 37,
    title: 'Regularization and Model Complexity',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Model Quality',
    description:
      'Regularization adds a penalty for model complexity, discouraging overfitting without requiring more data. L1 (Lasso) and L2 (Ridge) regularization are foundational techniques that appear throughout machine learning and deep learning.',
    objectives: [
      'Understand L1 and L2 regularization and their geometric interpretations',
      'Apply Ridge and Lasso regression with scikit-learn',
      'Observe how increasing regularization strength affects coefficients',
      'Use cross-validation to choose the optimal regularization strength',
    ],
    concepts: ['L1 penalty', 'L2 penalty', 'Regularization path', 'Sparsity from L1', 'Elastic net'],
    estimatedMinutes: 120,
    tasks: [
      'Fit Ridge regression with alpha=0.001, 0.01, 0.1, 1, 10 and plot how coefficients shrink',
      'Fit Lasso regression and observe which coefficients go to zero (feature selection effect)',
      'Use `RidgeCV` to automatically select the best alpha through cross-validation',
      'Write: what is the intuition behind regularization as a Bayesian prior?',
    ],
    reflectionQuestion: 'Why does L1 regularization produce sparse models while L2 does not?',
    resources: [
      { title: 'Scikit-learn — Ridge and Lasso', url: 'https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 38,
    title: 'Cross-Validation and Hyperparameter Tuning',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Model Quality',
    description:
      'Cross-validation gives a more reliable estimate of generalisation performance by evaluating on multiple held-out folds. Hyperparameter tuning finds the best settings for your model — but must be done carefully to avoid overfitting the validation set.',
    objectives: [
      'Implement k-fold and stratified k-fold cross-validation',
      'Run `GridSearchCV` and `RandomizedSearchCV` for hyperparameter tuning',
      'Understand nested cross-validation for unbiased performance estimation',
      'Choose hyperparameter search strategy based on budget and space size',
    ],
    concepts: ['k-fold CV', 'Leave-one-out CV', 'Nested CV', 'Grid search', 'Random search', 'Bayesian optimization'],
    estimatedMinutes: 150,
    tasks: [
      'Run 5-fold CV on a random forest and report mean and 95% confidence interval of the CV score',
      'Use `GridSearchCV` to tune `max_depth` and `n_estimators` for a random forest',
      'Use `RandomizedSearchCV` on the same grid and compare the results and time taken',
      'Explain why you should not use the test set for hyperparameter selection, even once',
    ],
    reflectionQuestion: 'What is the risk of tuning too many hyperparameters on your validation set?',
    resources: [
      { title: 'Scikit-learn — Grid Search', url: 'https://scikit-learn.org/stable/modules/grid_search.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 39,
    title: 'Feature Engineering',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Feature Engineering',
    description:
      'Feature engineering transforms raw data into inputs that help models learn. A good feature can improve a model\'s performance more than any algorithm choice. It requires domain knowledge, creativity, and careful validation.',
    objectives: [
      'Create new features through combinations, transformations, and aggregations',
      'Apply log transforms to skewed distributions',
      'Generate date-based features from timestamps',
      'Evaluate which engineered features improve model performance',
    ],
    concepts: ['Polynomial features', 'Log transforms', 'Interaction features', 'Binning', 'Temporal features'],
    estimatedMinutes: 150,
    tasks: [
      'Add three interaction features (product of two existing features) to a dataset and measure accuracy change',
      'Apply a log1p transform to a right-skewed numeric column and show the before/after distributions',
      'Extract day-of-week, hour, and is_weekend from a datetime column',
      'Build a feature importance table after adding new features and identify which new features helped most',
    ],
    reflectionQuestion: 'What is the risk of adding too many engineered features without validation?',
    resources: [
      { title: 'Scikit-learn — Feature Engineering', url: 'https://scikit-learn.org/stable/modules/feature_extraction.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 40,
    title: 'Class Imbalance and Appropriate Evaluation Metrics',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Evaluation',
    description:
      'Many real problems are imbalanced: fraud represents 0.1% of transactions, cancer represents a small fraction of scans. Training on imbalanced data without care produces models that predict the majority class and appear accurate while being useless.',
    objectives: [
      'Detect and quantify class imbalance in a dataset',
      'Apply oversampling (SMOTE) and undersampling strategies',
      'Use `class_weight="balanced"` in scikit-learn estimators',
      'Choose evaluation metrics appropriate for imbalanced problems',
    ],
    concepts: ['Class imbalance', 'Oversampling', 'SMOTE', 'Undersampling', 'Precision-recall AUC', 'Matthews Correlation Coefficient'],
    estimatedMinutes: 120,
    tasks: [
      'Create an imbalanced dataset with 95% negative, 5% positive and train a classifier',
      'Compare accuracy, F1, and PR-AUC before and after applying SMOTE oversampling',
      'Retrain with `class_weight="balanced"` and compare results',
      'Explain: why is a PR-AUC curve more informative than ROC-AUC for highly imbalanced problems?',
    ],
    reflectionQuestion: 'A model predicts "no fraud" for every transaction and achieves 99.9% accuracy. What metric would catch this failure?',
    resources: [
      { title: 'Imbalanced-learn Documentation', url: 'https://imbalanced-learn.org/stable/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 41,
    title: 'Model Interpretability and Feature Importance',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Explainability',
    description:
      'Deploying a model you cannot explain is a liability. Interpretability tools help you understand why a model makes a prediction, debug failures, and build stakeholder trust. SHAP values are the gold standard for model-agnostic explanations.',
    objectives: [
      'Compare intrinsic interpretability (trees, linear) vs. post-hoc explanations',
      'Compute permutation feature importance for any model',
      'Use SHAP values to explain individual predictions',
      'Identify model behaviour that is surprising or concerning',
    ],
    concepts: ['Intrinsic vs. post-hoc interpretability', 'Permutation importance', 'SHAP values', 'LIME', 'Partial dependence plots'],
    estimatedMinutes: 150,
    tasks: [
      'Compute permutation feature importance on a random forest and compare to tree-based importance',
      'Install SHAP and generate a summary plot for the same model',
      'Explain one specific prediction using a SHAP waterfall plot',
      'Find a prediction that surprises you and investigate which features drove it',
    ],
    reflectionQuestion: 'If a model uses a feature that is a proxy for a protected characteristic, what are the implications?',
    resources: [
      { title: 'SHAP Documentation', url: 'https://shap.readthedocs.io/en/latest/', type: 'docs' },
      { title: 'Scikit-learn — Permutation Importance', url: 'https://scikit-learn.org/stable/modules/permutation_importance.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 42,
    title: 'Project: An End-to-End Machine Learning Model',
    stage: 6,
    stageName: 'Reliable Machine Learning',
    category: 'Project',
    description:
      'Apply everything from Stages 4–6 to build a complete, production-quality ML pipeline: data ingestion, cleaning, EDA, feature engineering, model comparison, hyperparameter tuning, final evaluation, and a clear model card.',
    objectives: [
      'Complete the full ML workflow from raw data to evaluated model',
      'Write a model card documenting performance, limitations, and appropriate use',
      'Package the pipeline with a `Pipeline` object that can be serialised',
      'Commit all code with clear documentation to your learning repo',
    ],
    concepts: ['End-to-end ML pipeline', 'Model card', 'Serialisation with joblib', 'Documentation standards'],
    estimatedMinutes: 240,
    tasks: [
      'Choose a dataset with at least 1000 rows and a clear prediction task',
      'Complete EDA, cleaning, and feature engineering in a structured notebook',
      'Compare at least four models with cross-validation and select the best',
      'Tune the selected model, evaluate on the held-out test set (once), and record the result',
      'Write a model card: what does the model predict, how accurate is it, where does it fail, and who should use it?',
      'Save the trained pipeline with `joblib.dump` and write a script that loads and uses it',
    ],
    reflectionQuestion: 'What would need to change in your pipeline if the data distribution shifted significantly over time?',
    resources: [
      { title: 'Google Model Cards', url: 'https://modelcards.withgoogle.com/about', type: 'docs' },
      { title: 'Joblib — Persisting Models', url: 'https://joblib.readthedocs.io/en/latest/persistence.html', type: 'docs' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 7 — DEEP LEARNING
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 43,
    title: 'The Perceptron and Artificial Neurons',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'Neural Networks',
    description:
      'The perceptron is the conceptual ancestor of all neural networks. Understanding how a single artificial neuron computes a weighted sum, applies an activation, and learns through a simple update rule gives you the foundation for everything that follows.',
    objectives: [
      'Describe the perceptron model: inputs, weights, bias, activation',
      'Implement a single perceptron from scratch in NumPy',
      'Demonstrate perceptron learning on a linearly separable problem',
      'Identify what a single perceptron cannot learn (XOR)',
    ],
    concepts: ['Weighted sum', 'Activation function', 'Perceptron update rule', 'Linear separability', 'Threshold activation'],
    estimatedMinutes: 120,
    tasks: [
      'Implement a perceptron class in NumPy with `fit()` and `predict()` methods',
      'Train it on the AND and OR logic gates and verify it converges',
      'Attempt to train it on XOR and observe the failure',
      'Plot the decision boundary after training on a 2-D dataset',
    ],
    reflectionQuestion: 'Why can a single perceptron only solve linearly separable problems, and how does stacking layers solve this?',
    resources: [
      { title: 'Nielsen — Neural Networks and Deep Learning (Ch.1)', url: 'http://neuralnetworksanddeeplearning.com/chap1.html', type: 'article' },
    ],
    published: false,
  },
  {
    day: 44,
    title: 'Neural Network Layers and Architectures',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'Neural Networks',
    description:
      'A neural network is a composition of layers. Each layer transforms its input through a learned linear map followed by a non-linear activation. Understanding layer types, widths, and how data flows through a network (forward pass) is the first step towards building your own.',
    objectives: [
      'Describe fully-connected (dense) layers and how information flows',
      'Understand the role of hidden layers and network depth',
      'Compute the output of a 2-layer network by hand',
      'Recognize common architectures: MLP, CNN, RNN',
    ],
    concepts: ['Layer', 'Hidden units', 'Forward pass', 'Network depth vs. width', 'Parameter count'],
    estimatedMinutes: 120,
    tasks: [
      'Draw a 3-layer neural network (input, hidden, output) with explicit weight matrices',
      'Compute the forward pass by hand for a (2, 4, 1) network on a single input',
      'Count the total number of learnable parameters in the network',
      'Describe in words what each layer in a classification MLP is "doing"',
    ],
    reflectionQuestion: 'Why do deeper networks (more layers) learn more abstract representations than wider networks (more units per layer)?',
    resources: [
      { title: 'PyTorch Docs — Neural Networks Tutorial', url: 'https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 45,
    title: 'Activation Functions and Loss Functions',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'Neural Networks',
    description:
      'Without non-linear activation functions, a deep network collapses to a linear transformation. Without a loss function, there is nothing to minimise. These two components define what a network can represent and what it is trained to do.',
    objectives: [
      'Compare ReLU, sigmoid, tanh, and softmax and know when to use each',
      'Understand why ReLU is preferred over sigmoid in hidden layers',
      'Derive and implement MSE and cross-entropy loss',
      'Match loss function to task: regression vs. binary vs. multiclass',
    ],
    concepts: ['ReLU', 'Sigmoid', 'Softmax', 'Vanishing gradient', 'MSE loss', 'Cross-entropy loss'],
    estimatedMinutes: 120,
    tasks: [
      'Plot ReLU, sigmoid, tanh, and leaky-ReLU side by side from x=−5 to x=5',
      'Implement binary cross-entropy loss from scratch and verify against PyTorch\'s result',
      'Explain the vanishing gradient problem: why does sigmoid cause it in deep networks?',
      'Choose the correct loss and output activation for: house price prediction, spam detection, digit classification',
    ],
    reflectionQuestion: 'What goes wrong when you use ReLU as the output activation for a binary classifier?',
    resources: [
      { title: 'PyTorch Docs — Loss Functions', url: 'https://pytorch.org/docs/stable/nn.html#loss-functions', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 46,
    title: 'Gradient Descent and Backpropagation',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'Neural Networks',
    description:
      'Backpropagation is the algorithm that computes the gradient of the loss with respect to every weight in a neural network using the chain rule of calculus. It is the reason deep learning works. Understanding it removes the black-box feeling from training.',
    objectives: [
      'Trace the chain rule through a two-layer network by hand',
      'Understand how automatic differentiation (autograd) implements backprop',
      'Compare SGD, Adam, and RMSProp and understand what Adam adds',
      'Implement a manual backward pass for a simple network',
    ],
    concepts: ['Backpropagation', 'Chain rule', 'Gradient accumulation', 'SGD', 'Adam optimizer', 'Learning rate scheduling'],
    estimatedMinutes: 150,
    tasks: [
      'Manually compute the backward pass for a 2-layer network on one example and verify with PyTorch autograd',
      'Train the same network with SGD, Adam, and RMSProp and compare convergence speed',
      'Plot the training loss over epochs for each optimizer',
      'Read the Adam paper abstract and write a one-paragraph summary of what it improves over SGD',
    ],
    reflectionQuestion: 'Why can gradient descent get stuck in a local minimum, and why is this usually not catastrophic in deep learning?',
    resources: [
      { title: 'Andrej Karpathy — micrograd', url: 'https://github.com/karpathy/micrograd', type: 'repo' },
      { title: 'PyTorch Docs — Autograd', url: 'https://pytorch.org/docs/stable/autograd.html', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 47,
    title: 'PyTorch Tensors and Automatic Differentiation',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'PyTorch',
    description:
      'PyTorch is the dominant deep learning framework for research and is widely used in production. Its tensor API mirrors NumPy, and its autograd system makes differentiation automatic. Today you become comfortable with the PyTorch tensor workflow.',
    objectives: [
      'Create and manipulate PyTorch tensors and understand their relationship to NumPy arrays',
      'Move tensors between CPU and GPU',
      'Use `requires_grad=True` and compute gradients automatically',
      'Understand the computational graph and `loss.backward()`',
    ],
    concepts: ['Tensor', 'Computational graph', 'requires_grad', 'backward()', 'gradient accumulation', 'detach()'],
    estimatedMinutes: 120,
    tasks: [
      'Create a tensor of shape (3, 4) and perform the same operations as in Day 8 using PyTorch',
      'Create a leaf tensor with `requires_grad=True`, compute a scalar loss, and call `.backward()`',
      'Inspect the `.grad` attribute and verify it matches the manual derivative',
      'Move a tensor to GPU if available and confirm the device with `.device`',
    ],
    reflectionQuestion: 'Why does PyTorch accumulate gradients by default instead of replacing them, and when does this behaviour cause bugs?',
    resources: [
      { title: 'PyTorch Docs — Tensors', url: 'https://pytorch.org/docs/stable/tensors.html', type: 'docs' },
      { title: 'PyTorch 60-Minute Blitz', url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 48,
    title: 'Writing a Neural Network Training Loop',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'PyTorch',
    description:
      'The training loop is the heart of every deep learning project. It orchestrates data loading, the forward pass, loss computation, backpropagation, and parameter updates. Writing it from scratch cements your understanding of how training actually works.',
    objectives: [
      'Write a complete training loop using `nn.Module`, `DataLoader`, and an optimizer',
      'Log training loss and validation loss at each epoch',
      'Implement early stopping based on validation loss',
      'Save and load model checkpoints',
    ],
    concepts: ['nn.Module', 'DataLoader', 'Optimizer.step()', 'zero_grad()', 'train() vs. eval() mode', 'Checkpointing'],
    estimatedMinutes: 180,
    tasks: [
      'Define an MLP using `nn.Module` for binary classification on a synthetic dataset',
      'Write a training loop with forward pass, loss computation, backward pass, and optimizer step',
      'Evaluate on a validation set at each epoch and plot training/validation loss curves',
      'Save the best model checkpoint with `torch.save` and reload it correctly',
    ],
    reflectionQuestion: 'Why must you call `optimizer.zero_grad()` before `loss.backward()` every iteration?',
    resources: [
      { title: 'PyTorch Docs — Training a Classifier', url: 'https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 49,
    title: 'CNNs and Image Classification',
    stage: 7,
    stageName: 'Deep Learning',
    category: 'Computer Vision',
    description:
      'Convolutional Neural Networks are designed for spatial data. They exploit local structure through learned filters, translational invariance through pooling, and hierarchical representations through stacked layers. They are the foundation of computer vision.',
    objectives: [
      'Understand convolution, filter kernels, stride, and padding',
      'Build a small CNN with PyTorch for image classification',
      'Apply transfer learning using a pretrained model',
      'Evaluate on a subset of CIFAR-10 and interpret the results',
    ],
    concepts: ['Convolution operation', 'Feature maps', 'Pooling', 'Receptive field', 'Transfer learning', 'Fine-tuning'],
    estimatedMinutes: 180,
    tasks: [
      'Build a 3-layer CNN for CIFAR-10: [Conv → ReLU → Pool] × 2 → FC → Softmax',
      'Train for 10 epochs and compare with an MLP of similar parameter count',
      'Load a pretrained ResNet-18 and fine-tune only the final classification layer on CIFAR-10',
      'Display 9 correctly-classified and 9 misclassified images with their predicted labels',
    ],
    reflectionQuestion: 'Why does a convolutional layer with shared weights have far fewer parameters than a fully-connected layer of the same output size?',
    resources: [
      { title: 'PyTorch Docs — torchvision Models', url: 'https://pytorch.org/vision/stable/models.html', type: 'docs' },
      { title: 'CS231n — Convolutional Networks', url: 'https://cs231n.github.io/convolutional-networks/', type: 'tutorial' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 8 — NLP AND TRANSFORMERS
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 50,
    title: 'Text Preprocessing and Tokenization',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'NLP',
    description:
      'Text must be converted into numbers before a model can process it. Tokenization — splitting text into units — is the critical first step. Understanding the difference between word, character, and subword tokenization shapes how you build NLP applications.',
    objectives: [
      'Clean and normalize raw text: lowercase, punctuation, stopwords',
      'Apply word tokenization with NLTK and character tokenization manually',
      'Understand byte-pair encoding (BPE) and why it is used in LLMs',
      'Tokenize text with the Hugging Face tokenizer and inspect the result',
    ],
    concepts: ['Tokenization', 'Subword BPE', 'Vocabulary', 'Token IDs', 'Padding and truncation'],
    estimatedMinutes: 120,
    tasks: [
      'Clean a paragraph of text: lowercase, remove punctuation, remove stopwords',
      'Tokenize the same paragraph at the word and character level and count vocabulary size',
      'Use `AutoTokenizer.from_pretrained("bert-base-uncased")` and inspect the input_ids and attention_mask',
      'Tokenize an unusual word (a proper noun, slang, or foreign term) and examine how it is split into subwords',
    ],
    reflectionQuestion: 'Why does byte-pair encoding produce a smaller vocabulary than word-level tokenization while handling rare words better?',
    resources: [
      { title: 'Hugging Face Tokenizers', url: 'https://huggingface.co/docs/tokenizers/index', type: 'docs' },
      { title: 'NLTK Documentation', url: 'https://www.nltk.org/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 51,
    title: 'Bag-of-Words and TF-IDF',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'NLP',
    description:
      'Before neural NLP, bag-of-words and TF-IDF were the standard representations. They ignore word order but capture term frequency in a way that works surprisingly well for classification and retrieval. Understanding them builds intuition for what embeddings improve upon.',
    objectives: [
      'Represent text as a bag-of-words vector using scikit-learn',
      'Apply TF-IDF weighting and understand its effect on common words',
      'Train a text classifier on TF-IDF features',
      'Identify the limitations of order-ignorant representations',
    ],
    concepts: ['Bag-of-words', 'Term frequency', 'Inverse document frequency', 'Sparse matrix', 'Vocabulary size'],
    estimatedMinutes: 120,
    tasks: [
      'Vectorize a small text corpus using `CountVectorizer` and inspect the resulting sparse matrix',
      'Apply `TfidfVectorizer` and compare the resulting weights for common vs. rare words',
      'Train a `LogisticRegression` classifier on TF-IDF features of the 20 Newsgroups dataset',
      'Identify the ten most informative words for two contrasting topic categories',
    ],
    reflectionQuestion: 'What does TF-IDF weighting tell you about the relative importance of words across documents?',
    resources: [
      { title: 'Scikit-learn — Text Feature Extraction', url: 'https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 52,
    title: 'Embeddings and Semantic Similarity',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'NLP',
    description:
      'Word embeddings map tokens to dense vectors in a continuous semantic space. Similar words are close together; dissimilar words are far apart. This representation is the backbone of modern NLP and retrieval systems.',
    objectives: [
      'Load pre-trained Word2Vec or GloVe embeddings',
      'Compute cosine similarity between word and sentence embeddings',
      'Use the `sentence-transformers` library to embed sentences',
      'Build a simple semantic search over a small document set',
    ],
    concepts: ['Word2Vec', 'GloVe', 'Embedding space', 'Cosine similarity', 'Sentence embeddings', 'Semantic search'],
    estimatedMinutes: 150,
    tasks: [
      'Load GloVe embeddings and find the five nearest neighbours of "king", "doctor", and "python"',
      'Compute the famous king − man + woman analogy and verify the result',
      'Embed ten sentences using `sentence-transformers/all-MiniLM-L6-v2` and compute a similarity matrix',
      'Build a function that takes a query sentence and returns the three most similar sentences from a corpus',
    ],
    reflectionQuestion: 'Why do word embeddings capture analogies like "king − man + woman ≈ queen"?',
    resources: [
      { title: 'Sentence Transformers Docs', url: 'https://www.sbert.net/', type: 'docs' },
      { title: 'GloVe Pretrained Vectors', url: 'https://nlp.stanford.edu/projects/glove/', type: 'repo' },
    ],
    published: false,
  },
  {
    day: 53,
    title: 'Attention and Relationships Between Tokens',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'NLP',
    description:
      'Attention allows a model to focus on the most relevant parts of the input when producing each output token. Self-attention — where a sequence attends to itself — is the key innovation in transformers and what makes them so powerful for language.',
    objectives: [
      'Understand the attention mechanism conceptually: query, key, value',
      'Compute a scaled dot-product attention by hand on a small example',
      'Visualize attention weights to see what a model "looks at"',
      'Distinguish self-attention from cross-attention',
    ],
    concepts: ['Query, Key, Value', 'Scaled dot-product attention', 'Softmax normalization', 'Multi-head attention', 'Attention mask'],
    estimatedMinutes: 150,
    tasks: [
      'Implement scaled dot-product attention in NumPy from the "Attention Is All You Need" formula',
      'Run it on a 4-token sequence and plot the resulting attention weight matrix as a heatmap',
      'Explain in writing why dividing by √d_k stabilizes the softmax gradients',
      'Use BertViz or a similar tool to visualize attention heads in a BERT model on a sample sentence',
    ],
    reflectionQuestion: 'What does it mean for a token to "attend" to another token, and why is this more powerful than fixed-window context?',
    resources: [
      { title: 'Attention Is All You Need (Paper)', url: 'https://arxiv.org/abs/1706.03762', type: 'article' },
      { title: 'Jay Alammar — The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'article' },
    ],
    published: false,
  },
  {
    day: 54,
    title: 'Transformer Architecture',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'NLP',
    description:
      'The transformer architecture, introduced in 2017, replaced recurrence with attention and became the foundation of every modern language model. Understanding how an encoder and decoder are built from multi-head attention, positional encoding, and feed-forward layers gives you a working mental model of BERT, GPT, and T5.',
    objectives: [
      'Describe the encoder and decoder stacks of the original transformer',
      'Understand positional encoding and why it is necessary',
      'Trace the flow of a single token through a transformer encoder',
      'Distinguish encoder-only, decoder-only, and encoder-decoder architectures',
    ],
    concepts: ['Encoder-decoder', 'Positional encoding', 'Layer normalization', 'Residual connections', 'Feed-forward sublayer'],
    estimatedMinutes: 150,
    tasks: [
      'Draw the full transformer encoder block with all sublayers labeled',
      'Implement sinusoidal positional encoding in NumPy and visualize it as a heatmap',
      'Explain residual connections: what problem do they solve in deep networks?',
      'Map GPT-2, BERT, and T5 to the correct architecture type (encoder-only, decoder-only, encoder-decoder)',
    ],
    reflectionQuestion: 'Why did transformers replace recurrent networks as the dominant NLP architecture?',
    resources: [
      { title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'article' },
      { title: 'Hugging Face — Transformers Course Ch.1', url: 'https://huggingface.co/learn/nlp-course/chapter1', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 55,
    title: 'Pretrained Models and Transfer Learning',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'NLP',
    description:
      'Pretraining on billions of tokens gives language models a rich understanding of language before they see a single labelled example. Transfer learning uses this knowledge for downstream tasks with far less data than training from scratch.',
    objectives: [
      'Load and run inference with a pretrained model from Hugging Face',
      'Fine-tune a pretrained BERT model on a text classification task',
      'Understand the difference between feature extraction and fine-tuning',
      'Evaluate the fine-tuned model and compare with a TF-IDF baseline',
    ],
    concepts: ['Pretraining', 'Fine-tuning', 'Feature extraction', 'Hugging Face pipeline', 'Tokenizer + model pair'],
    estimatedMinutes: 180,
    tasks: [
      'Use a Hugging Face pipeline for sentiment analysis and test it on ten sentences',
      'Load `bert-base-uncased` and fine-tune it on the IMDB dataset using the Trainer API',
      'Compare fine-tuned BERT accuracy against the TF-IDF + LogisticRegression baseline from Day 51',
      'Explain: when would you use feature extraction instead of fine-tuning?',
    ],
    reflectionQuestion: 'Why does fine-tuning a pretrained model require far less labelled data than training from scratch?',
    resources: [
      { title: 'Hugging Face Transformers Docs', url: 'https://huggingface.co/docs/transformers/index', type: 'docs' },
      { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 56,
    title: 'Mini-Project: Building an NLP Application',
    stage: 8,
    stageName: 'NLP and Transformers',
    category: 'Project',
    description:
      'Apply the NLP techniques from Stage 8 to build a self-contained application: a text classifier, a semantic search tool, or a summarizer. The focus is on integrating tokenization, embeddings, and a pretrained model into something that actually works end-to-end.',
    objectives: [
      'Choose and scope a realistic NLP application',
      'Integrate tokenization, embeddings, and a pretrained model',
      'Evaluate and report results honestly',
      'Document the application for a non-technical reader',
    ],
    concepts: ['End-to-end NLP pipeline', 'Task framing', 'Model selection', 'Error analysis', 'Failure modes'],
    estimatedMinutes: 240,
    tasks: [
      'Choose one: news classifier, semantic Q&A retriever, or document summarizer',
      'Build the full pipeline: data → preprocess → embed/tokenize → model → output',
      'Evaluate on a held-out set and report at least two metrics',
      'Describe five examples where the system fails and hypothesize why',
      'Commit code and write a README explaining what the system does and how to run it',
    ],
    reflectionQuestion: 'What would a user of your application misunderstand about what it can and cannot do?',
    resources: [
      { title: 'Hugging Face Datasets', url: 'https://huggingface.co/docs/datasets/index', type: 'docs' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 9 — LLMS AND GENERATIVE AI
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 57,
    title: 'Language Models, Tokens and Context Windows',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'A language model predicts the probability of the next token given all previous tokens. Understanding tokens, context windows, and the autoregressive generation process is essential before working with any LLM API.',
    objectives: [
      'Explain what a language model does in precise terms',
      'Understand tokens: what they are, how they are counted, and why they cost money',
      'Explain context windows and their practical implications',
      'Use an LLM API to generate text and inspect the token usage',
    ],
    concepts: ['Autoregressive generation', 'Token', 'Context window', 'Temperature', 'Top-k and top-p sampling'],
    estimatedMinutes: 120,
    tasks: [
      'Use the OpenAI API or an equivalent free API to generate completions for five different prompts',
      'Count tokens in each prompt and completion using a tokenizer library',
      'Experiment with temperature=0.2 vs. temperature=1.2 and describe the difference in outputs',
      'Estimate the cost of 1,000 API calls at your chosen model\'s pricing',
    ],
    reflectionQuestion: 'What happens when your context exceeds the model\'s window limit, and how can you handle it?',
    resources: [
      { title: 'OpenAI Tokenizer Tool', url: 'https://platform.openai.com/tokenizer', type: 'docs' },
      { title: 'Hugging Face — LLM Course', url: 'https://huggingface.co/learn/llm-course', type: 'tutorial' },
    ],
    published: false,
  },
  {
    day: 58,
    title: 'Prompting and Structured Outputs',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'Prompting is the primary interface to a language model. Well-designed prompts dramatically improve output quality and consistency. Structured output techniques — JSON mode, few-shot examples, instruction tuning — make LLM outputs reliable enough to use programmatically.',
    objectives: [
      'Apply zero-shot, one-shot, and few-shot prompting strategies',
      'Use chain-of-thought prompting for reasoning tasks',
      'Request structured JSON output from an LLM',
      'Write a reusable prompt template with variables',
    ],
    concepts: ['Zero-shot prompting', 'Few-shot prompting', 'Chain-of-thought', 'System prompt', 'JSON mode', 'Prompt injection'],
    estimatedMinutes: 150,
    tasks: [
      'Compare zero-shot and three-shot prompting on a classification task',
      'Use chain-of-thought prompting to solve a multi-step arithmetic problem',
      'Request a JSON object with a specific schema from an LLM and parse the result in Python',
      'Find an example where your prompt produces a wrong answer and redesign it to fix the failure',
    ],
    reflectionQuestion: 'Why is specifying the output format in the prompt more reliable than asking the model to "try its best"?',
    resources: [
      { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'docs' },
      { title: 'OpenAI Structured Outputs', url: 'https://platform.openai.com/docs/guides/structured-outputs', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 59,
    title: 'Hallucinations, Grounding and Model Limitations',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'LLMs confidently generate plausible-sounding text that is factually wrong. This is not a bug to be fixed with a patch — it is a fundamental property of generative models. Understanding why hallucinations occur and how to reduce them is critical for building reliable AI applications.',
    objectives: [
      'Define hallucination and explain its root cause in LLMs',
      'Distinguish factual hallucination, reasoning errors, and confabulation',
      'Apply grounding techniques: citing sources, retrieval, constrained generation',
      'Design prompts that minimize hallucination risk',
    ],
    concepts: ['Hallucination', 'Grounding', 'Confabulation', 'Self-consistency', 'Source citation', 'Constitutional AI'],
    estimatedMinutes: 120,
    tasks: [
      'Prompt an LLM about a niche topic and find at least one factual error in its response',
      'Apply a grounding technique: provide the correct context in the prompt and observe the change',
      'Use self-consistency sampling: generate the same question five times and find the majority answer',
      'Write a short list of prompt design rules that reduce the risk of hallucination',
    ],
    reflectionQuestion: 'Is it possible to completely eliminate hallucinations in LLMs? Why or why not?',
    resources: [
      { title: 'Survey of Hallucination in LLMs', url: 'https://arxiv.org/abs/2309.01219', type: 'article' },
    ],
    published: false,
  },
  {
    day: 60,
    title: 'Retrieval-Augmented Generation',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'RAG connects an LLM to an external knowledge base, allowing it to answer questions about documents it was not trained on without the risk of making up facts from memory. It is currently one of the most widely deployed patterns in production AI.',
    objectives: [
      'Explain the RAG architecture: retrieve, augment, generate',
      'Build a minimal RAG pipeline over a small document set',
      'Understand the role of the retriever and the generator',
      'Identify the failure modes of RAG systems',
    ],
    concepts: ['Retrieval-augmented generation', 'Dense retrieval', 'Context stuffing', 'RAG vs. fine-tuning', 'Long-context models'],
    estimatedMinutes: 150,
    tasks: [
      'Load five short documents into memory and embed them with `sentence-transformers`',
      'Given a query, retrieve the top-2 most similar documents using cosine similarity',
      'Pass the retrieved documents as context to an LLM and compare its answer with/without context',
      'Identify two situations where RAG gives a wrong answer and explain why',
    ],
    reflectionQuestion: 'When is RAG preferable to fine-tuning the model on your documents?',
    resources: [
      { title: 'RAG Paper (Lewis et al., 2020)', url: 'https://arxiv.org/abs/2005.11401', type: 'article' },
    ],
    published: false,
  },
  {
    day: 61,
    title: 'Document Chunking and Information Retrieval',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'Long documents must be split into chunks before embedding. Chunking strategy dramatically affects retrieval quality: too small and you lose context, too large and you dilute the semantic signal. Today you experiment with different chunking strategies and measure their effect.',
    objectives: [
      'Split documents using fixed-size, sentence-based, and recursive strategies',
      'Evaluate retrieval quality at different chunk sizes',
      'Add metadata to chunks (source, page, section) for attribution',
      'Implement a simple BM25 retriever as a baseline',
    ],
    concepts: ['Text chunking', 'Chunk size and overlap', 'Semantic chunking', 'BM25', 'Hybrid retrieval'],
    estimatedMinutes: 150,
    tasks: [
      'Split a 10-page document using fixed 200-token chunks with 50-token overlap',
      'Try sentence-based splitting and compare the chunk count and average length',
      'Run five queries against both chunking strategies and score which retrieves the most relevant chunk',
      'Add source document and page number metadata to each chunk',
    ],
    reflectionQuestion: 'How does chunk size affect the precision and recall of your retriever?',
    resources: [
      { title: 'LangChain Text Splitters', url: 'https://python.langchain.com/docs/concepts/text_splitters/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 62,
    title: 'Vector Databases and Embedding-Based Search',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'A vector database stores and indexes high-dimensional embeddings, enabling fast approximate nearest-neighbour search at scale. FAISS, Chroma, Pinecone, and Weaviate are the primary choices. Today you build a production-grade retriever backed by a vector store.',
    objectives: [
      'Understand approximate nearest-neighbour (ANN) search and why it is needed at scale',
      'Index embeddings using FAISS and Chroma locally',
      'Query the vector store and retrieve top-k results',
      'Compare vector search performance with and without an index',
    ],
    concepts: ['FAISS', 'Chroma', 'ANN search', 'IVF indexing', 'HNSW', 'Filtering by metadata'],
    estimatedMinutes: 150,
    tasks: [
      'Embed 500 chunks from a set of documents using `sentence-transformers`',
      'Index the embeddings in FAISS (flat L2) and query with five test questions',
      'Set up the same documents in ChromaDB and run the same queries',
      'Measure and compare query latency for FAISS flat vs. FAISS IVF index',
    ],
    reflectionQuestion: 'What is the trade-off between index accuracy and query speed in approximate nearest-neighbour search?',
    resources: [
      { title: 'FAISS Wiki', url: 'https://github.com/facebookresearch/faiss/wiki', type: 'docs' },
      { title: 'Chroma Documentation', url: 'https://docs.trychroma.com/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 63,
    title: 'Evaluating a RAG System',
    stage: 9,
    stageName: 'LLMs and Generative AI',
    category: 'LLMs',
    description:
      'A RAG system can fail in at least three places: the retriever fails to find relevant chunks, the generator ignores retrieved context, or the answer is factually wrong despite good retrieval. Today you measure retrieval and generation quality with principled metrics.',
    objectives: [
      'Measure retrieval quality: recall@k, MRR, and NDCG',
      'Evaluate generation quality: faithfulness, answer relevance, and context precision',
      'Use RAGAS or a simple evaluation harness to automate assessment',
      'Identify the biggest bottleneck in your RAG pipeline',
    ],
    concepts: ['Recall@k', 'MRR', 'Faithfulness', 'Answer relevance', 'RAGAS', 'Evaluation-driven development'],
    estimatedMinutes: 150,
    tasks: [
      'Build a 10-question evaluation set with gold-standard answers from your document corpus',
      'Compute Recall@1 and Recall@5 for your retriever on the evaluation set',
      'Use an LLM judge to score the faithfulness of generated answers on a 1–5 scale',
      'Identify the two lowest-scoring questions and explain what went wrong',
    ],
    reflectionQuestion: 'Why is automated evaluation of RAG systems inherently imperfect, and how can you mitigate this?',
    resources: [
      { title: 'RAGAS Documentation', url: 'https://docs.ragas.io/', type: 'docs' },
    ],
    published: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STAGE 10 — DEPLOYMENT AND CAPSTONE
  // ──────────────────────────────────────────────────────────────────────────
  {
    day: 64,
    title: 'Serving a Model Through FastAPI',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Deployment',
    description:
      'A model is only useful when it can serve predictions to other systems. FastAPI makes it straightforward to expose a model as a REST API with automatic documentation, request validation, and async support.',
    objectives: [
      'Build a FastAPI endpoint that accepts input and returns a model prediction',
      'Add request validation using Pydantic models',
      'Test the API with `httpx` or the Swagger UI',
      'Handle errors and edge cases with proper HTTP status codes',
    ],
    concepts: ['REST API', 'FastAPI', 'Pydantic', 'Endpoint versioning', 'Async prediction', 'CORS'],
    estimatedMinutes: 150,
    tasks: [
      'Create a `/predict` endpoint that accepts JSON input and returns a scikit-learn model\'s prediction',
      'Add a `/health` endpoint that returns the model version and status',
      'Write Pydantic models for the request and response to enforce types',
      'Test all endpoints using the built-in Swagger UI at `/docs`',
    ],
    reflectionQuestion: 'What happens if you deploy a model API and the model file changes? How would you manage model versioning?',
    resources: [
      { title: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 65,
    title: 'Building an Interactive Demo with Gradio',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Deployment',
    description:
      'Gradio allows you to build an interactive web interface for any Python function in minutes. It is the standard way to share AI demos without deploying a full frontend application.',
    objectives: [
      'Build a Gradio interface for a text or image model',
      'Add examples, descriptions, and clear labels to the interface',
      'Share the demo via a public Gradio link',
      'Understand the limitations of Gradio for production use',
    ],
    concepts: ['Gradio Interface', 'Gradio Blocks', 'Inputs and outputs', 'Shareable link', 'State management'],
    estimatedMinutes: 120,
    tasks: [
      'Wrap a text sentiment classifier in a Gradio `Interface` and test it in the browser',
      'Add five example inputs and a description that explains what the model does',
      'Use `gr.Blocks()` to add a second tab showing the top-3 class probabilities',
      'Generate a shareable link and confirm it is publicly accessible',
    ],
    reflectionQuestion: 'What are the risks of making a model public through a shareable Gradio link?',
    resources: [
      { title: 'Gradio Documentation', url: 'https://www.gradio.app/docs/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 66,
    title: 'Publishing With Hugging Face Spaces and GitHub',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Deployment',
    description:
      'Hugging Face Spaces is free hosting for Gradio and Streamlit applications. Combined with a well-documented GitHub repository, it gives your project a permanent, public home that demonstrates your skills to collaborators and employers.',
    objectives: [
      'Deploy a Gradio app to Hugging Face Spaces',
      'Write a Space README with title, description, and model card',
      'Link the Space to its corresponding GitHub repository',
      'Tag the model and app correctly for discoverability',
    ],
    concepts: ['Hugging Face Spaces', 'Space configuration', 'Model Hub', 'README metadata', 'Static vs. dynamic spaces'],
    estimatedMinutes: 120,
    tasks: [
      'Create a Hugging Face account and push the Gradio app from Day 65 to a new Space',
      'Write a Space README that explains: what the model does, its limitations, and how to use it',
      'Link the Space to your GitHub learning repository in the README',
      'Confirm the Space is publicly visible and the link works',
    ],
    reflectionQuestion: 'What should you include in a Space README to help someone unfamiliar with your project understand what it does?',
    resources: [
      { title: 'Hugging Face Spaces Docs', url: 'https://huggingface.co/docs/hub/spaces', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 67,
    title: 'Testing, Reproducibility and Dependency Management',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Engineering',
    description:
      'An AI project that cannot be reproduced is worthless. Pinned dependencies, random seeds, environment documentation, and automated tests transform a notebook experiment into reliable engineering.',
    objectives: [
      'Write unit tests for data preprocessing and model helper functions',
      'Pin all dependencies with exact versions in `requirements.txt`',
      'Set and document random seeds for reproducibility',
      'Write a Makefile or shell script that reproduces the full training run from scratch',
    ],
    concepts: ['pytest', 'requirements.txt', 'Random seed', 'Reproducibility', 'CI basics', 'Docker for ML'],
    estimatedMinutes: 150,
    tasks: [
      'Write three pytest tests for your data preprocessing pipeline from Stage 4–5',
      'Generate `requirements.txt` with pinned versions using `pip freeze`',
      'Document every random seed used in your codebase in a REPRODUCIBILITY.md file',
      'Confirm that running your setup from a clean environment produces the same model metrics',
    ],
    reflectionQuestion: 'Why is reproducibility difficult in ML, and what are the three biggest sources of non-determinism?',
    resources: [
      { title: 'pytest Documentation', url: 'https://docs.pytest.org/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 68,
    title: 'Latency, Cost, Privacy and AI Safety',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Engineering',
    description:
      'Production AI systems live in a world of competing constraints: latency budgets, token costs, data privacy regulations, and safety risks. Understanding these trade-offs is what separates an AI hobbyist from a professional AI engineer.',
    objectives: [
      'Measure inference latency and identify bottlenecks',
      'Estimate and optimize the cost of LLM API calls',
      'Identify what personal data your system processes and why this matters legally',
      'Understand prompt injection and jailbreaking as adversarial attacks',
    ],
    concepts: ['Inference latency', 'Throughput', 'Token cost optimization', 'GDPR basics', 'Prompt injection', 'AI safety principles'],
    estimatedMinutes: 150,
    tasks: [
      'Benchmark inference latency for your model: measure p50, p95, and p99 latency over 100 requests',
      'Estimate the monthly API cost for 10,000 daily active users each sending five queries',
      'List every type of personal data your application touches and identify applicable regulations',
      'Attempt a prompt injection attack on your own application and document how it succeeds or fails',
    ],
    reflectionQuestion: 'At what point does optimizing for cost conflict with optimizing for safety? Give a specific example.',
    resources: [
      { title: 'OWASP Top 10 for LLMs', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', type: 'docs' },
    ],
    published: false,
  },
  {
    day: 69,
    title: 'Integrating and Evaluating the Capstone',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Project',
    description:
      'Today you assemble your capstone project: a complete, functional AI application that demonstrates what you have learned across all ten stages. It should have a working backend, a usable interface, and documented limitations.',
    objectives: [
      'Integrate all components into a single deployable application',
      'Run a full evaluation and document the results honestly',
      'Identify and document three known limitations',
      'Prepare a written summary suitable for a portfolio',
    ],
    concepts: ['System integration', 'End-to-end evaluation', 'Honest documentation', 'Portfolio presentation'],
    estimatedMinutes: 240,
    tasks: [
      'Connect your FastAPI backend, Gradio frontend, retriever, and LLM into one running system',
      'Run your evaluation harness from Day 63 and record the final metrics',
      'Write a one-page technical summary: what does it do, how was it built, what are its limitations?',
      'Record a 2-minute demo video or write a detailed walkthrough in your README',
    ],
    reflectionQuestion: 'What would you build differently if you were starting this capstone today with 70 days of knowledge?',
    resources: [
      { title: 'Google — Responsible AI Practices', url: 'https://ai.google/responsibility/responsible-ai-practices/', type: 'article' },
    ],
    published: false,
  },
  {
    day: 70,
    title: 'Publishing the Portfolio and Planning the Next Stage',
    stage: 10,
    stageName: 'Deployment and Capstone',
    category: 'Reflection',
    description:
      'Day 70 is not the finish line — it is the launching pad. Today you publish your complete portfolio, reflect on the journey, identify genuine gaps, and map your next 30–90 days of intentional learning.',
    objectives: [
      'Publish a polished portfolio that showcases your 70-day journey',
      'Write an honest retrospective: what you learned, what surprised you, where you struggled',
      'Identify three areas for deepening over the next 90 days',
      'Plan your next learning challenge with the same structure',
    ],
    concepts: ['Portfolio presentation', 'Learning retrospective', 'Personal learning roadmap', 'Community contribution'],
    estimatedMinutes: 180,
    tasks: [
      'Ensure all projects have working demos, documented limitations, and public GitHub links',
      'Write a 500-word retrospective: what changed in how you think about AI?',
      'Choose your next learning focus: ML systems, research papers, a specialization, or open-source contribution',
      'Share your learning journey on Substack, X, or LinkedIn — inspire someone else to start',
      'Set a specific learning goal for the next 30 days and write it down',
    ],
    reflectionQuestion: 'What is one belief about AI that you held on Day 1 that you now understand was wrong or incomplete?',
    resources: [
      { title: 'Papers With Code', url: 'https://paperswithcode.com/', type: 'repo' },
      { title: 'ML Engineer Learning Path', url: 'https://roadmap.sh/ml-engineer', type: 'docs' },
    ],
    published: false,
  },
]

/** Helper: get a day by number */
export function getDayByNumber(n: number): RoadmapDay | undefined {
  return roadmap.find((d) => d.day === n)
}

/** Helper: get all days for a given stage */
export function getDaysByStage(stageNumber: number): RoadmapDay[] {
  return roadmap.filter((d) => d.stage === stageNumber)
}
