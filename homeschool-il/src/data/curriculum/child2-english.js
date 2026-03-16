export default {
  starter: [
    {
      id: "e2s1",
      title: "ABC ופוניקה",
      titleEn: "ABC & Phonics",
      desc: "זיהוי אותיות ראשונות",
      exercises: [
        { q: "Which word starts with B? Ball or Cat?", type: "text", answer: "BALL" },
        { q: "Which word starts with D? Apple or Dog?", type: "text", answer: "DOG" },
        { q: "Which word starts with F? Fish or Bird?", type: "text", answer: "FISH" },
        { q: "Which word starts with H? Hat or Bag?", type: "text", answer: "HAT" },
        { q: "Which word starts with R? Sun or Rain?", type: "text", answer: "RAIN" },
      ],
    },
  ],
  basic: [
    {
      id: "e2b1",
      title: "מילות מפתח נפוצות",
      titleEn: "Common Sight Words",
      desc: "the, is, and, a, to",
      exercises: [
        { q: "Fill in: ___ cat is big. (The/A/Is)", type: "text", answer: "THE" },
        { q: "Fill in: She ___ happy. (and/is/the)", type: "text", answer: "IS" },
        { q: "Fill in: I like cats ___ dogs. (to/and/a)", type: "text", answer: "AND" },
        { q: "Fill in: I want ___ eat. (a/to/and)", type: "text", answer: "TO" },
        { q: "Fill in: I have ___ dog. (the/is/a)", type: "text", answer: "A" },
      ],
    },
    {
      id: "e2b2",
      title: "חלקי הגוף",
      titleEn: "Body Parts",
      desc: "eyes, mouth, hand, head, ears",
      exercises: [
        { q: "What do you see with? 👁️", type: "text", answer: "EYES" },
        { q: "What do you eat with? 👄", type: "text", answer: "MOUTH" },
        { q: "What do you write with? ✋", type: "text", answer: "HAND" },
        { q: "What do you think with? 🧠 (it's on top)", type: "text", answer: "HEAD" },
        { q: "What do you hear with? 👂", type: "text", answer: "EARS" },
      ],
    },
  ],
  intermediate: [
    {
      id: "e2i1",
      title: "זמן הווה פשוט",
      titleEn: "Present Simple Tense",
      desc: "I go / She reads / They play",
      exercises: [
        { q: "Complete: I ___ to school. (go/goes/going)", type: "text", answer: "GO" },
        { q: "Complete: She ___ a book. (read/reads/reading)", type: "text", answer: "READS" },
        { q: "Complete: They ___ soccer. (play/plays/playing)", type: "text", answer: "PLAY" },
        { q: "Complete: He ___ fast. (run/runs/running)", type: "text", answer: "RUNS" },
        { q: "Complete: We ___ apples. (like/likes/liking)", type: "text", answer: "LIKE" },
      ],
    },
    {
      id: "e2i2",
      title: "מילות שאלה",
      titleEn: "Question Words",
      desc: "What, Where, Who, How",
      exercises: [
        { q: "___ is your name? (What/Where/Who)", type: "text", answer: "WHAT" },
        { q: "___ do you live? (What/Where/Who)", type: "text", answer: "WHERE" },
        { q: "___ is your teacher? (What/Where/Who)", type: "text", answer: "WHO" },
        { q: "___ are you? I am fine. (What/How/Where)", type: "text", answer: "HOW" },
        { q: "___ old are you? (What/How/Where)", type: "text", answer: "HOW" },
      ],
    },
  ],
  advanced: [
    {
      id: "e2a1",
      title: "הבנת הנקרא",
      titleEn: "Reading Comprehension",
      desc: "קטע קצר ושאלות",
      exercises: [
        { q: "Read: Tom has a dog. The dog is black. What color is the dog?", type: "text", answer: "BLACK" },
        { q: "Read: Sara likes to read. She reads every day. What does Sara like?", type: "text", answer: "READ" },
        { q: "Read: It is cold today. Dan wears a coat. What does Dan wear?", type: "text", answer: "COAT" },
        { q: "Read: The cat sits on a mat. Where does the cat sit?", type: "text", answer: "MAT" },
        { q: "Read: Mia has five apples. She eats two. How many are left?", type: "number", answer: 3 },
      ],
    },
    {
      id: "e2a2",
      title: "כתיבה יצירתית",
      titleEn: "Creative Writing Basics",
      desc: "חיבורים עם but, because, then, or, so",
      exercises: [
        { q: "Choose the connector: I was tired ___ I slept early. (but/so/or)", type: "text", answer: "SO" },
        { q: "Choose the connector: I like cats ___ not dogs. (or/but/so)", type: "text", answer: "BUT" },
        { q: "Choose the connector: She cried ___ she was sad. (then/because/or)", type: "text", answer: "BECAUSE" },
        { q: "Choose the connector: He studied, ___ he passed the test. (then/but/or)", type: "text", answer: "THEN" },
        { q: "Choose the connector: You can have cake ___ ice cream. (but/so/or)", type: "text", answer: "OR" },
      ],
    },
  ],
};
