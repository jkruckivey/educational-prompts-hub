const educationalPrompts = [
  {
    id: 1,
    title: "Generate Explanations, Examples, and Analogies",
    category: "Content Creation",
    chapter: "Chapter 3 - Improving an Existing Class",
    author: "Lilach Mollick and Ethan Mollick, University of Pennsylvania",
    description: "Generate clear, accurate examples for students of concepts using specific examples and multiple analogies",
    prompt: "You generate clear, accurate examples for students of concepts. I want you to ask me two questions: what concept do I want explained, and what the audience is for the explanation. Provide a clear, multiple paragraph explanation of the concept using a specific example and give me five analogies I can use to understand the concept in different ways.",
    tags: ["explanations", "analogies", "examples", "concept clarification"]
  },
  {
    id: 2,
    title: "Improve Class Slides",
    category: "Content Enhancement",
    chapter: "Chapter 3 - Improving an Existing Class", 
    author: "Dan Levy, Harvard Kennedy School",
    description: "Get specific, actionable advice to improve PowerPoint presentations using effective slide principles",
    prompt: "I am a faculty member at a university looking for ways to improve my teaching. I would like the PowerPoint presentation to be as engaging as possible using the principles of effective slides. I would like to conduct the session using pedagogic principles of effective teaching and learning. Please give me advice on how to improve my slides. The advice should be specific and easy to implement. For example, on slide 11, break the text into shorter sentences or bullet points. Or for slide 13, include a simple example of a decision tree diagram. Please give the advice slide by slide.",
    tags: ["slides", "presentations", "visual design", "engagement"]
  },
  {
    id: 3,
    title: "Generate Engaging In-Class Activities",
    category: "Active Learning",
    chapter: "Chapter 4 - Preparing for a New Class",
    author: "Kimberly D. Acquaviva, University of Virginia",
    description: "Create quick, interactive activities that can be inserted into existing classes to increase student engagement",
    prompt: "I am now looking for ways to incorporate active learning into this class. Since the class is tomorrow and I don't have time to overhaul the class, I would like you to look at my materials and suggest places in the class where I could insert an activity that would make students actively engage in their learning. These activities could include answering a poll for an important question that can help me check for understanding or help them grapple with an important idea in the class, discuss a topic or do an exercise in small groups, or have a class wide discussion on a question important to the class goals. Each of your suggestions should take no more than 5-10 minutes to implement in the classroom.",
    tags: ["active learning", "engagement", "polls", "discussions", "quick activities"]
  },
  {
    id: 4,
    title: "Design Assessment Questions",
    category: "Assessment",
    chapter: "Chapter 4 - Preparing for a New Class",
    author: "Dan Levy, Harvard Kennedy School",
    description: "Create exit ticket questions and assessments that accurately measure whether learning goals were met",
    prompt: "Can you please suggest some 'exit ticket' questions that I can ask students to answer at the end of class that would give me a good sense of whether my learning goals were met? Please generate 3-5 questions, and I will choose 1-2. Please make sure that these questions can be answered in 5 minutes or less. I am particularly interested in assessing their understanding of each of the following areas: (1) game theory, (2) group decision-making, and (3) how to avoid biases in group decision-making. Please create 3 questions for each of these areas: an easy one, a medium one, and a hard one. Please make the easy one as a multiple-choice question and the other two as short essays.",
    tags: ["assessment", "exit tickets", "evaluation", "learning measurement"]
  },
  {
    id: 5,
    title: "Analyze Student Answers",
    category: "Data Analysis", 
    chapter: "Chapter 5 - Designing Pre-Class Work",
    author: "Dan Levy, Harvard Kennedy School",
    description: "Get insights from student responses to improve teaching and identify patterns in understanding",
    prompt: "I have attached answers to a pre-class exercise that I asked my students to respond to based on a case they read about high-profile public health decisions that German Minister of Health, Jens Spahn, made during the first year of the COVID-19 pandemic. I would like your help in analyzing the student responses so I can gain insights that would help me teach the class better. The first task for you is to please give me a frequency distribution (in percent) of the answers to the question 'Q3a - If you had been in Spahn's shoes, would you have paused the use of the AstraZeneca vaccine on Monday March 15, 2021?' Please display answers in the following order: Yes, No, I would have done something different.",
    tags: ["analysis", "student responses", "data insights", "teaching improvement"]
  },
  {
    id: 6,
    title: "Create Diagnostic Quiz",
    category: "Assessment",
    chapter: "Chapter 5 - Designing Pre-Class Work",
    author: "Cynthia Alby, Georgia College and State University",
    description: "Generate highly diagnostic quizzes that reveal student understanding and misconceptions",
    prompt: "You are a quiz creator of highly diagnostic quizzes. You will make excellent low-stakes tests and diagnostics. You will ask me three questions: (1) What, specifically, should the quiz test? (2) For which audience is the quiz? (3) Is there a source you would recommend to draw from? (4) What type of questions do you want and how many? Once you have my answers you will construct questions to quiz the audience on that topic. The questions should be highly relevant and go beyond just facts. If there are multiple choice questions, they should include plausible, competitive alternate responses and should not include an 'all of the above option.' At the end of the quiz, you will provide an answer key and explain the right answer for each question.",
    tags: ["diagnostic", "quiz", "assessment", "understanding check"]
  },
  {
    id: 7,
    title: "Student Learning Template",
    category: "Student Support",
    chapter: "Part III - Ways Your Students Can Use ChatGPT",
    author: "Dan Levy, Harvard Kennedy School",
    description: "Provide students with a structured template for learning new concepts effectively",
    prompt: "I would like to learn about signal detection theory. I don't have much background on this topic. Please use examples in the health field. Explain to me as if I were a high school student. I learn better through examples. Please give me an explanation in about 3 paragraphs. Quiz me at the end to make sure I understood, and give me feedback on my answers.",
    tags: ["student learning", "personalized", "scaffolding", "comprehension"]
  },
  {
    id: 8,
    title: "Design Class Plan",
    category: "Lesson Planning",
    chapter: "Chapter 4 - Preparing for a New Class",
    author: "Lilach Mollick and Ethan Mollick, University of Pennsylvania",
    description: "Create comprehensive, interactive lesson plans with clear learning goals and assessment strategies",
    prompt: "You are a helpful, practical teaching assistant who is an expert lesson planner. You know every lesson is part of a sequence. A well-planned lesson sequence allows for students to participate and discuss and includes a mix of modalities that could include a variety of activities such as a lecture, group work, individual tasks, creative exercises, and presentations, and include feedback and checks for understanding. While your goal is to plan one lesson, consider the lesson from the perspective of the full sequence of lessons. For any lesson you can define a learning goal, pinpointing what you want your students to think about and practice. You should also anticipate common difficulties that might come up and take steps to help students overcome these.",
    tags: ["lesson planning", "instructional design", "learning objectives", "sequencing"]
  },
  {
    id: 9,
    title: "Generate Pre-Class Resources",
    category: "Content Creation",
    chapter: "Chapter 5 - Designing Pre-Class Work", 
    author: "Chris (Economics Instructor)",
    description: "Create introductory readings and resources for students to engage with before class",
    prompt: "I am teaching an introductory economics course for college students. I would like students to become familiar with the sunk cost fallacy before class. Assume my students have some familiarity with basic concepts in economics but many of them are not familiar with sunk cost fallacy. The students can handle basic math and graphs, but some of them are rusty with calculus. Can you please produce an introductory reading for these students using examples they can relate to? They seem to be very interested in sports, and our women's basketball team has a big game coming up that everyone is talking about. I would like students to spend no more than 10 minutes with this resource, so it cannot be very long. In your explanation, please connect with basic economic concepts students typically learn in an introductory econ course (opportunity cost, thinking at the margin, utility maximization, etc.)",
    tags: ["pre-class", "readings", "preparation", "foundational concepts"]
  },
  {
    id: 10,
    title: "Grade Student Work with Rubrics",
    category: "Assessment",
    chapter: "Chapter 7 - Designing and Grading Assessments",
    author: "Bruce Ellis, Texas Computer Education Association",
    description: "Provide specific, constructive feedback based on detailed rubrics",
    prompt: "Act as an expert educator who is able to read information, analyze text and give supportive feedback based on a rubric that I will give you. Students were given the following assignment: [ASSIGNMENT]. When you are ready, I will give you the rubric. I will then begin to give you the student work to evaluate and you will provide specific, constructive and meaningful feedback in a first-person, supportive voice. If the score given is less than [TOTAL POINTS] points, provide a brief paragraph on specific steps the student can do to improve the work and earn full credit based on the rubric.",
    tags: ["grading", "feedback", "rubrics", "assessment", "constructive criticism"]
  }];

// Add more prompts from the PDF
educationalPrompts.push(
  {
    id: 11,
    title: "Statistics Practice with Bayes Rule",
    category: "Student Support",
    chapter: "Chapter 10 - Building Customized Chatbots",
    author: "Teddy Svoronos, Harvard Kennedy School",
    description: "Practice statistics problems with step-by-step guidance and error checking",
    prompt: "You are a friendly and patient instructor in a statistics class for public policy students. Your job is to help students understand course skills by giving them practice problems and checking their answers. Beware that students will often give incorrect answers, and it is critical that you correctly identify any errors in their responses. Always double-check your work, ensuring that both the logic and math are correct. Your goal is to develop the student's ability to calculate probabilities from a policy-relevant scenario using Bayes' Rule. Provide the student with a public policy scenario that lays out a policy problem in words, and includes two events that each have their own probabilities. Then, ask the student to calculate a particular probability.",
    tags: ["statistics", "bayes rule", "practice", "policy scenarios"]
  },
  {
    id: 12,
    title: "Debate Economic Perspectives",
    category: "Active Learning",
    chapter: "Chapter 6 - Using ChatGPT During Class",
    author: "Chris (Economics Instructor)",
    description: "Engage in structured debates between different economic schools of thought",
    prompt: "You are an expert in Keynesian economics. I am an expert in neoclassical economics. We are having a debate in front of a class about how to reduce the level of unemployment in the country. I will present arguments from a neoclassical perspective, emphasizing market efficiency, flexible wages, and minimal government intervention. Your task is to counter my arguments with Keynesian principles, focusing on the importance of aggregate demand, government intervention, and the role of fiscal and monetary policy in addressing unemployment. Let's keep our debate respectful, insightful, and rigorous.",
    tags: ["debate", "economics", "keynesian", "neoclassical", "unemployment"]
  },
  {
    id: 13,
    title: "Student Reflection Coach",
    category: "Student Support",
    chapter: "Chapter 8 - How Students Can Use ChatGPT to Learn",
    author: "Blake, Harvard Kennedy School",
    description: "Help students reflect deeply on team experiences and learning",
    prompt: "You are a helpful friendly coach helping me reflect on a recent team experience. Introduce yourself. Explain that you're here as their coach to help them reflect on the experience. Think step by step and wait for me to answer before doing anything else. Do not share your plan. Reflect on each step of the conversation and then decide what to do next. Ask only 1 question at a time. Ask me to think about the experience and name 1 challenge that we overcame and 1 challenge that we did not overcome. Wait for a response.",
    tags: ["reflection", "coaching", "team experience", "learning"]
  },
  {
    id: 14,
    title: "Philosophical Argument Exploration",
    category: "Critical Thinking",
    chapter: "Chapter 8 - How Students Can Use ChatGPT to Learn",
    author: "Angela Pérez, Harvard Kennedy School Student",
    description: "Explore philosophical arguments through structured debate and analysis",
    prompt: "I'm a student in a graduate public policy program trying to learn about Peter Singer's philosophy, as proposed in 'Famine, Affluence and Morality'. To help deepen my understanding, I want to simulate a conversation between two philosophers debating the following moral argument: 'When we buy new clothes not to keep ourselves warm but to look 'well-dressed' we are not providing for any important need. We would not be sacrificing anything significant if we were to continue to wear our old clothes and give the money to famine relief.' You will play a philosopher who is enthusiastic about Singer's moral philosophy and you are trying to convince me of the moral validity of the above argument, though you are also curious and amenable to changing your mind.",
    tags: ["philosophy", "ethics", "debate", "critical thinking", "peter singer"]
  },
  {
    id: 15,
    title: "Educational Adventure Game Creator",
    category: "Gamification",
    chapter: "Chapter 9 - Nudging Students to learn with ChatGPT",
    author: "Matthew Wemyss, Cambridge School of Bucharest",
    description: "Create text-based adventure games for educational purposes",
    prompt: "You are an expert in designing text-based adventure games for educational purposes. Ask me to provide the following information: Age of the students, Subject being taught, Learning Objectives. Refrain from generating the game until I have given you the required details. After I have provided the information, generate a text-based adventure game that follows educational game design principles with branching paths, multiple-choice questions related to learning objectives, and immersive storytelling appropriate for the age group.",
    tags: ["gamification", "adventure game", "interactive learning", "education"]
  }
);
// Export for use in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = educationalPrompts;
} else if (typeof window !== 'undefined') {
  window.educationalPrompts = educationalPrompts;
}