const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 340;

// مراحل اللعبة بالترتيب
let gameScene = "firstDialogue"; // "firstDialogue", "walkingToCafe", "cafeDialogue", "endScene"

// المحادثة الأولى المعكوسة
const firstDialogueSteps = [
    { speaker: "الصديق", text: "أهلاً يا صديقي!", targetSpeaker: "friend" },
    { speaker: "أنت", text: "أهلاً بك.", targetSpeaker: "player" },
    { speaker: "أنت", text: "ماذا ستفعل اليوم؟", targetSpeaker: "player" },
    { speaker: "الصديق", text: "أخطط لسرقة متجر، هل ستأتي معي؟", isQuestion: true, targetSpeaker: "friend" }
];

let currentStep = 0;
let characterX = -30; // دخول اللاعب ماشياً في البداية
let friendX = 440;
let isWalking = true;
let animTimer = 0;
let finalResult = "";

function updateDialogue() {
    if (gameScene === "firstDialogue") {
        const step = firstDialogueSteps[currentStep];
        document.getElementById("speaker-name").innerText = step.speaker;
        document.getElementById("dialogue-text").innerText = step.text;

        const nextBtn = document.getElementById("next-btn");
        const choicesContainer = document.getElementById("choices-container");

        if (step.isQuestion) {
            nextBtn.style.display = "none";
            choicesContainer.style.display = "flex";
            // تعديل أزرار الاختيار للسؤال الأول
            document.getElementById("btn-yes").innerText = "نعم";
            document.getElementById("btn-no").innerText = "لا";
        } else {
            nextBtn.style.display = "block";
            choicesContainer.style.display = "none";
        }
    } else if (gameScene === "cafeDialogue") {
        document.getElementById("speaker-name").innerText = "الصديق";
        document.getElementById("dialogue-text").innerText = "انظر، هذا المقهى أمامنا! دعنا ندخل وننضم إليهم قليلاً.";
        
        const nextBtn = document.getElementById("next-btn");
        const choicesContainer = document.getElementById("choices-container");
        nextBtn.style.display = "none";
        choicesContainer.style.display = "flex";
        // تعديل أزرار الاختيار للمشهد الثاني (المقهى)
        document.getElementById("btn-yes").innerText = "نعم (ندخل المكان)";
        document.getElementById("btn-no").innerText = "لا (نرفض وننصحه)";
    }
}

function nextDialogue() {
    if (gameScene === "firstDialogue" && !isWalking) {
        if (currentStep < firstDialogueSteps.length - 1) {
            currentStep++;
            updateDialogue();
        }
    }
}

// التعامل مع خيارات النعم واللا
function handleChoice(answer) {
    const speakerEl = document.getElementById("speaker-name");
    const textEl = document.getElementById("dialogue-text");
    const choicesContainer = document.getElementById("choices-container");
    const nextBtn = document.getElementById("next-btn");

    choicesContainer.style.display = "none";

    if (gameScene === "firstDialogue") {
        if (answer === 'yes') {
            // لو قال نعم للسرقة -> يطلب منه إعادة القصة
            speakerEl.innerText = "نهاية خاطئة";
            textEl.innerText = "سرقا ونجحا ولم يكشفا ولكن مع الاسف قطع رزقهما وقسي قلبهما ومات ضميرهما ويوم القيامة اخذت من حسناتهم وزادت سيئاتهم كما قال الله تعالي ﴿ وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ وَتُدْلُوا بِهَا إِلَى الْحُكَّامِ لِتَأْكُلُوا فَرِيقًا مِّنْ أَمْوَالِ النَّاسِ بِالْإِثْمِ وَأَنتُمْ تَعْلَمُونَ ﴾";
            nextBtn.style.display = "block";
            nextBtn.innerText = "إعادة القصة ⟳";
            nextBtn.onclick = function() { location.reload(); };
        } else {
             speakerEl.innerText = "طريق الصواب";
            textEl.innerText = "قلت لصديقك بحزم: 'لا، هذا فعل محرم وضار، وأقترح عليك أن تتركه'. اقتنع صديقك بنصيحتك، وقررتما معاً الذهاب للسلام علي صديقكما.";
            // لو قال لا -> تستمر القصة ويمشيان معاً لرؤية المقهى
            gameScene = "walkingToCafe";
            characterX = 80;
            friendX = 120;  
            isWalking = true; // يبدآن المشي معاً
        }
    } else if (gameScene === "cafeDialogue") {
        // الخيار الثاني أمام المقهى
        gameScene = "endScene";
        finalResult = answer;

        if (answer === 'yes') {
            speakerEl.innerText = "عواقب مرافقة السوء";
            textEl.innerText = "دخلتما المقهى واكتسبتم الذنوب وضاع وقتكم وقسي قلبكم كما قال الله تعالى: ﴿ وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ ﴾، وكانت عاقبة مرافقة السوء وخيمة.";
        } else {
            speakerEl.innerText = "نصيحة الحكمة والسلامة";
            textEl.innerText = "قلت لصديقك بحزم ورفق: 'يا صديقي، دعنا نترك هذا المكان ولا نقرب الشبهات، فالبعد عن المعاصي غنيمة'. فاستجاب لنصيحتك وشكرك واهتديتم معاً!";
        }

        nextBtn.style.display = "block";
        nextBtn.innerText = "إعادة القصة ⟳";
        nextBtn.onclick = function() { location.reload(); };
    }
}

// رسم الشخصيات وحركتها
function drawDetailedPlayer(x, y, isPlayer, isWalkingNow) {
    animTimer += 0.08;
    
    let bounce = 0;
    let legOffset = 0;
    
    if (isWalkingNow) {
        bounce = Math.abs(Math.sin(animTimer * 2.5)) * 3.5;
        legOffset = Math.sin(animTimer * 2.5) * 5;
    } else {
        bounce = Math.sin(animTimer) * 1;
    }

    const drawY = y - bounce;

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(x + 14, y + 60, 10 + (bounce * 0.4), 3, 0, 0, Math.PI * 2);
    ctx.fill();

    const robeMain = isPlayer ? "#f8f9fa" : "#1a365d";
    const robeShadow = isPlayer ? "#cbd5e1" : "#0f172a";
    const headCover = isPlayer ? "#ffffff" : "#d4af37";

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 6, y + 48 + legOffset, 5, 12);
    ctx.fillRect(x + 16, y + 48 - legOffset, 5, 12);

    ctx.fillStyle = robeMain;
    ctx.fillRect(x + 4, drawY + 20, 20, 30);
    ctx.fillStyle = robeShadow;
    ctx.fillRect(x + 4, drawY + 20, 4, 30);

    ctx.fillStyle = robeMain;
    ctx.fillRect(x, drawY + 24, 5, 14);
    ctx.fillRect(x + 19, drawY + 24, 5, 14);
    ctx.fillStyle = "#e0ac69";
    ctx.fillRect(x, drawY + 36, 4, 4);
    ctx.fillRect(x + 22, drawY + 36, 4, 4);

    ctx.fillStyle = "#e0ac69";
    ctx.fillRect(x + 6, drawY + 6, 16, 15);

    ctx.fillStyle = "#000000";
    ctx.fillRect(isPlayer ? x + 15 : x + 8, drawY + 11, 2, 2);

    ctx.fillStyle = headCover;
    ctx.fillRect(x + 4, drawY + 2, 20, 6);
    if (isPlayer) {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(x + 4, drawY + 5, 20, 2);
    } else {
        ctx.fillStyle = "#b45309";
        ctx.fillRect(x + 4, drawY + 4, 20, 3);
    }
}

// فقاعة الكلام
function drawSpeechBubble(text, x, y) {
    ctx.save();
    ctx.font = "bold 11px 'Cairo', sans-serif";
    const textWidth = ctx.measureText(text).width;
    const bubbleW = textWidth + 24;
    const bubbleH = 30;
    const bubbleX = x - (bubbleW / 2) + 12;
    const bubbleY = y - 55;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 12, bubbleY + bubbleH);
    ctx.lineTo(x + 16, bubbleY + bubbleH + 6);
    ctx.lineTo(x + 20, bubbleY + bubbleH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#060e0a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, bubbleX + (bubbleW / 2), bubbleY + (bubbleH / 2));
    ctx.restore();
}

function drawScene() {
    // خلفية السماء (تتحول للون داكن تنبيهي إذا دخلوا المقهى)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
    if (gameScene === "endScene" && finalResult === "yes") {
        skyGrad.addColorStop(0, "#2a0808");
        skyGrad.addColorStop(1, "#150404");
    } else {
        skyGrad.addColorStop(0, "#020604");
        skyGrad.addColorStop(1, "#071710");
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // نجوم وقمر
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillRect(90, 35, 2, 2);
    ctx.fillRect(380, 30, 2, 2);

    ctx.fillStyle = "#d4af37";
    ctx.beginPath();
    ctx.arc(70, 50, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#020604";
    ctx.beginPath();
    ctx.arc(75, 47, 13, 0, Math.PI * 2);
    ctx.fill();

    // رسم مبنى المقهى واللافته في الخلفية عند مشهد المشي أو المقهى
    if (gameScene === "walkingToCafe" || gameScene === "cafeDialogue" || gameScene === "endScene") {
        ctx.fillStyle = "#141c18";
        ctx.fillRect(320, 90, 240, 150);
        ctx.strokeStyle = "#8b0000";
        ctx.lineWidth = 2;
        ctx.strokeRect(320, 90, 240, 150);

        ctx.fillStyle = "#0a0f0d";
        ctx.fillRect(410, 160, 60, 80);

        ctx.fillStyle = "rgba(180, 0, 0, 0.25)";
        ctx.fillRect(340, 110, 50, 40);
        ctx.fillRect(490, 110, 50, 40);

        // لافته المقهى
        ctx.fillStyle = "#3d0a0a";
        ctx.fillRect(340, 50, 200, 32);
        ctx.strokeStyle = "#ff4d4d";
        ctx.strokeRect(340, 50, 200, 32);

        ctx.fillStyle = "#ffdddd";
        ctx.font = "bold 11px 'Cairo', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("مقهى المشروبات الروحية (BAR)", 440, 71);
    }

    // الطريق
    ctx.fillStyle = "#0f2319";
    ctx.fillRect(0, 240, canvas.width, 100);
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(0, 240, canvas.width, 3);
    ctx.fillStyle = "#1e3f2f";
    ctx.fillRect(0, 243, canvas.width, 8);

    // منطق الحركة
    if (gameScene === "firstDialogue") {
        if (isWalking) {
            characterX += 1.6;
            if (characterX >= 220) {
                characterX = 220;
                isWalking = false;
                updateDialogue();
            }
        }
        drawDetailedPlayer(friendX, 190, false, false);
        drawDetailedPlayer(characterX, 190, true, isWalking);
    } 
    else if (gameScene === "walkingToCafe") {
        // يمشيان معاً نحو المقهى
        characterX += 1.5;
        friendX += 1.5;

        // عندما يصلان أمام المقهى (عند إحداثيات معينة)
        if (characterX >= 180) {
            characterX = 180;
            friendX = 220;
            gameScene = "cafeScene"; // الوصول أمام المقهى وبدء الحوار الثاني
            updateDialogue();
        }

        drawDetailedPlayer(friendX, 190, false, true);
        drawDetailedPlayer(characterX, 190, true, true);
    }
    else {
        // وقوف الشخصيتين أثناء الحوار أمام المقهى أو النهاية
        drawDetailedPlayer(friendX, 190, false, false);
        drawDetailedPlayer(characterX, 190, true, false);

        if (gameScene === "cafeScene") {
            drawSpeechBubble("دعنا ندخل وننضم إليهم!", friendX, 190);
        } else if (gameScene === "endScene") {
            if (finalResult === "yes") {
                drawSpeechBubble("اكتسبنا الذنوب.. نهاية مؤلمة.", characterX, 190);
            } else {
                drawSpeechBubble("أحسنت بالنصيحة والابتعاد!", friendX, 190);
            }
        }
    }

    requestAnimationFrame(drawScene);
}

// البدء
drawScene();