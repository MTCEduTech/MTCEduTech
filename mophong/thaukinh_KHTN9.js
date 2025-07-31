document.addEventListener('DOMContentLoaded', () => {
    const objectDistanceSlider = document.getElementById('objectDistance');
    const objectHeightSlider = document = document.getElementById('objectHeight');
    const focalLengthSlider = document.getElementById('focalLength');

    const objectDistanceValueSpan = document.getElementById('objectDistanceValue');
    const objectHeightValueSpan = document.getElementById('objectHeightValue');
    const focalLengthValueSpan = document.getElementById('focalLengthValue');

    const objectElement = document.getElementById('object');
    const imageElement = document.getElementById('image');
    
    const focalPoint1 = document.getElementById('focalPoint1');
    const focalPoint2 = document.getElementById('focalPoint2');
    const opticalCenterElement = document.getElementById('opticalCenter');
    const twoFocalPoint1 = document.getElementById('twoFocalPoint1');
    const twoFocalPoint2 = document.getElementById('twoFocalPoint2');

    // Ray elements
    const ray1Incident = document.getElementById('ray1-incident');
    const ray1Refracted = document.getElementById('ray1-refracted');
    const ray2Incident = document.getElementById('ray2-incident');
    const ray2Refracted = document.getElementById('ray2-refracted');
    const ray3Incident = document.getElementById('ray3-incident');
    const ray3Refracted = document.getElementById('ray3-refracted');

    // Elements for image info display
    const imageInfoSectionDiv = document.getElementById('imageInfoSection'); // Vùng 4
    const imageDistanceSpan = document.getElementById('imageDistance');
    const imageHeightSpan = document.getElementById('imageHeight');
    const imageCharacteristicsSpan = document.getElementById('imageCharacteristics');
    const initialNoteParagraph = document.getElementById('initialNote');
    const imageInfoContentDiv = document.getElementById('imageInfoContent');

    // Elements for quiz display
    const quizSectionDiv = document.getElementById('quizSection'); // Vùng 5
    const quizQuestionsDiv = document.getElementById('quizQuestions');
    const quizResultParagraph = document.getElementById('quizResult');
    const updateQuizButton = document.getElementById('updateQuizButton');

    // Buttons for switching views
    const showImageInfoButton = document.getElementById('showImageInfoButton');
    const showQuizButton = document.getElementById('showQuizButton');
    const exportDocxButton = document.getElementById('exportDocxButton'); // Nút mới

    // Solution modal elements
    const showSolutionButton = document.getElementById('showSolutionButton');
    const solutionModal = document.getElementById('solutionModal');
    const closeButton = document.querySelector('.close-button');
    const solutionContent = document.getElementById('solutionContent');

    // Constants for simulation scaling
    const SIM_AREA_WIDTH = 1000; // Corresponds to the max-width in CSS
    const LENS_CENTER_OFFSET = SIM_AREA_WIDTH / 2; // Lens is at the center of the simulation area (x=500)
    const OPTICAL_AXIS_Y = 200; // Y-coordinate of the optical axis

    // Global variables to store current d and f for quiz generation
    let currentD, currentH, currentF;
    let generatedQuizQuestions = []; // To store questions with correct answers and rationales

    // Function to format numbers with comma as decimal separator
    function formatNumber(num, fixed = 2) {
        if (num === Infinity || num === -Infinity) {
            return "Vô cực";
        }
        return num.toFixed(fixed).replace('.', ',');
    }

    // Function to hide image info and show initial note
    const hideImageInfo = () => {
        imageInfoContentDiv.style.display = 'none';
        initialNoteParagraph.style.display = 'block';
    };

    // Function to show image info and hide initial note
    const showImageInfo = () => {
        imageInfoContentDiv.style.display = 'block';
        initialNoteParagraph.style.display = 'none';
    };

    function updateSimulation() {
        const d = parseFloat(objectDistanceSlider.value);
        const h = parseFloat(objectHeightSlider.value);
        const f = parseFloat(focalLengthSlider.value);

        currentD = d;
        currentH = h;
        currentF = f;

        objectDistanceValueSpan.textContent = d;
        objectHeightValueSpan.textContent = h;
        focalLengthValueSpan.textContent = f;

        // Scale factors for SVG coordinates
        const scale = 1; // 1 cm = 1 pixel

        // Object position (always on the left of the lens)
        const objectX = LENS_CENTER_OFFSET - d * scale;
        const objectY = OPTICAL_AXIS_Y - h * scale;

        objectElement.setAttribute('x1', objectX);
        objectElement.setAttribute('y1', OPTICAL_AXIS_Y);
        objectElement.setAttribute('x2', objectX);
        objectElement.setAttribute('y2', objectY);
        // Update object arrow
        objectElement.nextElementSibling.setAttribute('points', `${objectX - 5},${objectY} ${objectX + 5},${objectY} ${objectX},${objectY - 10}`);


        // Focal points positions
        focalPoint1.setAttribute('cx', LENS_CENTER_OFFSET - f * scale);
        focalPoint2.setAttribute('cx', LENS_CENTER_OFFSET + f * scale);
        document.getElementById('fLabel1').setAttribute('x', LENS_CENTER_OFFSET - f * scale - 10);
        document.getElementById('fLabel2').setAttribute('x', LENS_CENTER_OFFSET + f * scale + 5);

        // 2F points positions
        twoFocalPoint1.setAttribute('cx', LENS_CENTER_OFFSET - 2 * f * scale);
        twoFocalPoint2.setAttribute('cx', LENS_CENTER_OFFSET + 2 * f * scale);
        document.getElementById('twoFLabel1').setAttribute('x', LENS_CENTER_OFFSET - 2 * f * scale - 15);
        document.getElementById('twoFLabel2').setAttribute('x', LENS_CENTER_OFFSET + 2 * f * scale + 5);


        let d_prime, h_prime, characteristics;

        if (d === f) {
            d_prime = Infinity; // Parallel rays, image at infinity
            h_prime = Infinity;
            characteristics = "Ảnh ở vô cực, không thu được.";
            imageElement.style.display = 'none';
            document.getElementById('imageArrow').style.display = 'none';
            ray1Refracted.style.display = 'none';
            ray2Refracted.style.display = 'none';
            ray3Refracted.style.display = 'none'; // Hide ray 3 as it's parallel to the axis
            ray1Incident.style.display = 'none';
            ray2Incident.style.display = 'none';
            ray3Incident.style.display = 'none';
        } else {
            imageElement.style.display = 'block';
            document.getElementById('imageArrow').style.display = 'block';
            ray1Refracted.style.display = 'block';
            ray2Refracted.style.display = 'block';
            ray3Refracted.style.display = 'block';
            ray1Incident.style.display = 'block';
            ray2Incident.style.display = 'block';
            ray3Incident.style.display = 'block';

            // Thin lens equation: 1/f = 1/d + 1/d' => 1/d' = 1/f - 1/d = (d - f) / (f * d) => d' = (f * d) / (d - f)
            d_prime = (f * d) / (d - f);
            // Magnification: M = h'/h = -d'/d => h' = h * (-d'/d)
            h_prime = h * (-d_prime / d);

            imageX = LENS_CENTER_OFFSET + d_prime * scale;
            imageY = OPTICAL_AXIS_Y - h_prime * scale;

            imageElement.setAttribute('x1', imageX);
            imageElement.setAttribute('y1', OPTICAL_AXIS_Y);
            imageElement.setAttribute('x2', imageX);
            imageElement.setAttribute('y2', imageY);
            // Update image arrow direction based on h_prime sign
            if (h_prime < 0) { // Inverted image (real images are inverted for converging lens)
                document.getElementById('imageArrow').setAttribute('points', `${imageX - 5},${imageY} ${imageX + 5},${imageY} ${imageX},${imageY - 10}`);
            } else { // Upright image (virtual images are upright for converging lens)
                document.getElementById('imageArrow').setAttribute('points', `${imageX - 5},${imageY} ${imageX + 5},${imageY} ${imageX},${imageY + 10}`);
            }

            // Set dashed or solid line for the image based on real/virtual
            if (d_prime < 0) { // Virtual image
                imageElement.style.strokeDasharray = "5,5"; // Dashed line
                document.getElementById('imageArrow').style.strokeDasharray = "5,5"; // Dashed arrow
            } else { // Real image
                imageElement.style.strokeDasharray = "none"; // Solid line
                document.getElementById('imageArrow').style.strokeDasharray = "none"; // Solid arrow
            }


            // Determine image characteristics
            if (d_prime > 0) { // Real image
                characteristics = "Ảnh thật";
                if (h_prime < 0) { // Inverted
                    characteristics += ", ngược chiều";
                } else { // Upright (should not happen for real image with single converging lens)
                    characteristics += ", cùng chiều (Lỗi tính toán hoặc trường hợp đặc biệt)";
                }
            } else { // Virtual image
                characteristics = "Ảnh ảo";
                if (h_prime > 0) { // Upright
                    characteristics += ", cùng chiều";
                } else { // Inverted (should not happen for virtual image with single converging lens)
                    characteristics += ", ngược chiều (Lỗi tính toán hoặc trường hợp đặc biệt)";
                }
            }

            if (Math.abs(h_prime) < h) {
                characteristics += ", nhỏ hơn vật";
            } else if (Math.abs(h_prime) > h) {
                characteristics += ", lớn hơn vật";
            } else {
                characteristics += ", bằng vật";
            }

            // Ray Tracing
            const objectTopY = OPTICAL_AXIS_Y - h * scale;

            // Ray 1: Incident parallel to axis, refracts through F' (for real) or appears from F (for virtual)
            ray1Incident.setAttribute('x1', objectX);
            ray1Incident.setAttribute('y1', objectTopY);
            ray1Incident.setAttribute('x2', LENS_CENTER_OFFSET);
            ray1Incident.setAttribute('y2', objectTopY);

            ray1Refracted.setAttribute('x1', LENS_CENTER_OFFSET);
            ray1Refracted.setAttribute('y1', objectTopY);
            if (d_prime > 0) { // Real image: refracts through F'
                // Line from (LENS_CENTER_OFFSET, objectTopY) to (imageX, imageY)
                const slope = (imageY - objectTopY) / (imageX - LENS_CENTER_OFFSET);
                // Extend ray to the right edge of the SVG
                const extendX = SIM_AREA_WIDTH;
                const extendY = objectTopY + slope * (extendX - LENS_CENTER_OFFSET);
                ray1Refracted.setAttribute('x2', extendX);
                ray1Refracted.setAttribute('y2', extendY);
                ray1Refracted.style.strokeDasharray = "none"; // Solid line for real ray
            } else { // Virtual image: ray appears to come from image point if extended backwards
                // The refracted ray diverges. Its backward extension goes through F' (LENS_CENTER_OFFSET + f)
                // The actual ray diverges from the lens to the right.
                // The "appears from" F point for a parallel incident ray means its backward extension passes through F2 (Focal point on object side, not F')
                // Let's stick to the rule that parallel incident ray goes through F' (focus on the *other* side).
                // For virtual images, the ray should go *away* from F' after passing through the lens.
                // Point on the lens (LENS_CENTER_OFFSET, objectTopY)
                // Point F' is (LENS_CENTER_OFFSET + f, OPTICAL_AXIS_Y)
                // Slope from (LENS_CENTER_OFFSET + f, OPTICAL_AXIS_Y) to (LENS_CENTER_OFFSET, objectTopY)
                const slope_virtual_ray1 = (objectTopY - OPTICAL_AXIS_Y) / (-f * scale);
                // Extend the ray from the lens (LENS_CENTER_OFFSET, objectTopY) to the right
                const extendX = SIM_AREA_WIDTH;
                const extendY = objectTopY + slope_virtual_ray1 * (extendX - LENS_CENTER_OFFSET);
                ray1Refracted.setAttribute('x2', extendX);
                ray1Refracted.setAttribute('y2', extendY);
                ray1Refracted.style.strokeDasharray = "5,5"; // Dashed line for virtual extension
            }
            
            // Ray 2: Through optical center, goes straight
            ray2Incident.setAttribute('x1', objectX);
            ray2Incident.setAttribute('y1', objectTopY);
            ray2Incident.setAttribute('x2', LENS_CENTER_OFFSET);
            ray2Incident.setAttribute('y2', OPTICAL_AXIS_Y);

            ray2Refracted.setAttribute('x1', LENS_CENTER_OFFSET);
            ray2Refracted.setAttribute('y1', OPTICAL_AXIS_Y);
            if (d_prime > 0) { // Real image
                ray2Refracted.setAttribute('x2', imageX);
                ray2Refracted.setAttribute('y2', imageY);
                ray2Refracted.style.strokeDasharray = "none";
            } else { // Virtual image
                // Extend ray straight backwards to where the virtual image is
                const slope_ray2 = (objectTopY - OPTICAL_AXIS_Y) / (objectX - LENS_CENTER_OFFSET);
                const extendX_left = 0; // Extend to the left edge
                const extendY_left = OPTICAL_AXIS_Y + slope_ray2 * (extendX_left - LENS_CENTER_OFFSET);
                ray2Refracted.setAttribute('x2', extendX_left); // Draw to the left for virtual extension
                ray2Refracted.setAttribute('y2', extendY_left);
                ray2Refracted.style.strokeDasharray = "5,5"; // Dashed line for virtual extension
            }

            // Ray 3: Through F, refracts parallel to axis
            const x1_ray3_incident = objectX;
            const y1_ray3_incident = objectTopY;
            const x_f_left = LENS_CENTER_OFFSET - f * scale;
            const y_f_left = OPTICAL_AXIS_Y;

            // Calculate point where ray 3 hits the lens
            const slope_ray3_incident = (y_f_left - y1_ray3_incident) / (x_f_left - x1_ray3_incident);
            const y_hit_lens_ray3 = y1_ray3_incident + slope_ray3_incident * (LENS_CENTER_OFFSET - x1_ray3_incident);

            ray3Incident.setAttribute('x1', objectX);
            ray3Incident.setAttribute('y1', objectTopY);
            ray3Incident.setAttribute('x2', LENS_CENTER_OFFSET);
            ray3Incident.setAttribute('y2', y_hit_lens_ray3);

            ray3Refracted.setAttribute('x1', LENS_CENTER_OFFSET);
            ray3Refracted.setAttribute('y1', y_hit_lens_ray3);
            if (d_prime > 0) { // Real image: refracts parallel to axis
                ray3Refracted.setAttribute('x2', SIM_AREA_WIDTH);
                ray3Refracted.setAttribute('y2', y_hit_lens_ray3);
                ray3Refracted.style.strokeDasharray = "none";
            } else { // Virtual image: refracts parallel to axis (appears to come from image point)
                // The refracted ray should be parallel to the axis.
                // Its backward extension should pass through the image point.
                // This rule (ray through F refracts parallel) generally applies to real images.
                // For virtual images, the ray heading towards F2 (LENS_CENTER_OFFSET+f) will refract parallel.
                // This is (LENS_CENTER_OFFSET + f).
                // Ray coming from objectTopY towards (LENS_CENTER_OFFSET + f, OPTICAL_AXIS_Y) hits the lens at (LENS_CENTER_OFFSET, y_hit_lens)
                const targetFX = LENS_CENTER_OFFSET + f * scale;
                const targetFY = OPTICAL_AXIS_Y;
                const slope_to_F2 = (targetFY - objectTopY) / (targetFX - objectX);
                const y_hit_lens_ray3_virtual = objectTopY + slope_to_F2 * (LENS_CENTER_OFFSET - objectX);

                ray3Incident.setAttribute('x1', objectX);
                ray3Incident.setAttribute('y1', objectTopY);
                ray3Incident.setAttribute('x2', LENS_CENTER_OFFSET);
                ray3Incident.setAttribute('y2', y_hit_lens_ray3_virtual);

                ray3Refracted.setAttribute('x1', LENS_CENTER_OFFSET);
                ray3Refracted.setAttribute('y1', y_hit_lens_ray3_virtual);
                ray3Refracted.setAttribute('x2', SIM_AREA_WIDTH);
                ray3Refracted.setAttribute('y2', y_hit_lens_ray3_virtual); // Refracts parallel to axis
                ray3Refracted.style.strokeDasharray = "5,5"; // Dashed line
            }
        }

        imageDistanceSpan.textContent = formatNumber(d_prime);
        imageHeightSpan.textContent = formatNumber(Math.abs(h_prime));
        imageCharacteristicsSpan.textContent = characteristics;

        // Update solution modal content
        updateSolutionContent(d, h, f, d_prime, h_prime, characteristics);
    }

    function updateSolutionContent(d, h, f, d_prime, h_prime, characteristics) {
        let solutionHtml = `
            <h3>1. Công thức thấu kính:</h3>
            <p>Sử dụng công thức thấu kính mỏng:</p>
            $$ \\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d'} $$
            <p>Trong đó:</p>
            <ul>
                <li>$f$: tiêu cự của thấu kính (${f} cm)</li>
                <li>$d$: khoảng cách từ vật đến thấu kính (${d} cm)</li>
                <li>$d'$: khoảng cách từ ảnh đến thấu kính</li>
            </ul>
            <p>Từ đó, ta có thể suy ra $d'$:</p>
            $$ \\frac{1}{d'} = \\frac{1}{f} - \\frac{1}{d} = \\frac{d - f}{f \\times d} $$
            $$ d' = \\frac{f \\times d}{d - f} $$
            <p>Thay số vào: $d' = \\frac{${f} \\times ${d}}{${d} - ${f}} = ${formatNumber(d_prime)} \\text{ cm}$</p>

            <h3>2. Công thức độ phóng đại:</h3>
            <p>Sử dụng công thức độ phóng đại:</p>
            $$ k = \\frac{h'}{h} = -\\frac{d'}{d} $$
            <p>Trong đó:</p>
            <ul>
                <li>$k$: độ phóng đại</li>
                <li>$h$: chiều cao của vật (${h} cm)</li>
                <li>$h'$: chiều cao của ảnh</li>
            </ul>
            <p>Từ đó, ta có thể suy ra $h'$:</p>
            $$ h' = h \\times \\left(-\\frac{d'}{d}\\right) $$
            <p>Thay số vào: $h' = ${h} \\times \\left(-\\frac{${formatNumber(d_prime)}}{${d}}\\right) = ${formatNumber(h_prime)} \\text{ cm}$</p>

            <h3>3. Đặc điểm của ảnh:</h3>
        `;

        if (d_prime > 0) {
            solutionHtml += `<p>Vì $d' > 0$, ảnh tạo thành là <strong>ảnh thật</strong>.</p>`;
        } else if (d_prime < 0) {
            solutionHtml += `<p>Vì $d' < 0$, ảnh tạo thành là <strong>ảnh ảo</strong>.</p>`;
        } else { // d_prime is Infinity
            solutionHtml += `<p>Vì $d' = \\infty$, ảnh tạo thành là <strong>ảnh ở vô cực</strong>.</p>`;
        }

        if (h_prime < 0) {
            solutionHtml += `<p>Vì $h'$ có dấu ngược với $h$ (do $h_{gốc}$ là dương và $h'$ âm), ảnh <strong>ngược chiều</strong> với vật.</p>`;
        } else if (h_prime > 0) {
            solutionHtml += `<p>Vì $h'$ và $h$ cùng dấu, ảnh <strong>cùng chiều</strong> với vật.</p>`;
        } else {
             solutionHtml += `<p>Không xác định chiều cao ảnh vì ảnh ở vô cực.</p>`;
        }
        

        if (Math.abs(h_prime) < h) {
            solutionHtml += `<p>Vì $|h'| < h$, ảnh <strong>nhỏ hơn vật</strong>.</p>`;
        } else if (Math.abs(h_prime) > h) {
            solutionHtml += `<p>Vì $|h'| > h$, ảnh <strong>lớn hơn vật</strong>.</p>`;
        } else {
            solutionHtml += `<p>Vì $|h'| = h$, ảnh <strong>bằng vật</strong>.</p>`;
        }

        solutionHtml += `<p><strong>Tóm lại:</strong> ${characteristics}.</p>`;

        solutionContent.innerHTML = solutionHtml;
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([solutionContent]).then(() => {
                console.log('MathJax typeset completed for solution content.');
            });
        }
    }

    // Helper function to calculate d_prime, h_prime, and characteristics
    function calculateImageProperties(d, h, f) {
        let d_prime, h_prime, characteristics;

        if (d === f) {
            d_prime = Infinity;
            h_prime = Infinity;
            characteristics = "Ảnh ở vô cực";
        } else {
            d_prime = (f * d) / (d - f);
            h_prime = h * (-d_prime / d);

            if (d_prime > 0) {
                characteristics = "Ảnh thật";
                if (h_prime < 0) {
                    characteristics += ", ngược chiều";
                }
            } else {
                characteristics = "Ảnh ảo";
                if (h_prime > 0) {
                    characteristics += ", cùng chiều";
                }
            }

            if (Math.abs(h_prime) < h) {
                characteristics += ", nhỏ hơn vật";
            } else if (Math.abs(h_prime) > h) {
                characteristics += ", lớn hơn vật";
            } else {
                characteristics += ", bằng vật";
            }
        }
        return { d_prime, h_prime, characteristics };
    }

    // Function to generate quiz questions based on current simulation state
    function generateQuizQuestions() {
        generatedQuizQuestions = []; // Reset questions

        const { d_prime: current_d_prime, h_prime: current_h_prime, characteristics: current_characteristics } = calculateImageProperties(currentD, currentH, currentF);

        // Question 1: Calculate d' based on current sliders
        let q1_options = [
            { text: `${formatNumber(current_d_prime)} cm`, rationale: `Sử dụng công thức thấu kính mỏng: $1/d' = 1/f - 1/d = 1/${currentF} - 1/${currentD} = ${formatNumber(((currentD - currentF) / (currentF * currentD)), 4)}$. Từ đó, $d' = ${formatNumber((currentF * currentD) / (currentD - currentF))} \\text{ cm}$.`, isCorrect: true },
            { text: `${formatNumber(current_d_prime * 1.2)} cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false },
            { text: `${formatNumber(current_d_prime / 1.5)} cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false },
            { text: `${formatNumber(currentF + 10)} cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false }
        ];
        // Handle infinity case for d'
        if (current_d_prime === Infinity) {
             q1_options = [
                { text: `Vô cực`, rationale: `Khi vật đặt tại tiêu điểm ($d = f$), ảnh tạo thành ở vô cực.`, isCorrect: true },
                { text: `Khoảng 1000 cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false },
                { text: `0 cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false },
                { text: `Không xác định`, rationale: "Đây là cách diễn đạt không chính xác cho trường hợp này.", isCorrect: false }
            ];
        }
        q1_options.sort(() => Math.random() - 0.5);
        generatedQuizQuestions.push({
            question: `Với khoảng cách vật là ${currentD} cm và tiêu cự là ${currentF} cm, khoảng cách từ ảnh đến thấu kính (d') là bao nhiêu?`,
            answerOptions: q1_options,
            hint: "Hãy nhớ lại công thức thấu kính mỏng: $1/f = 1/d + 1/d'$."
        });

        // Question 2: Calculate h' based on current sliders
        let q2_options = [
            { text: `${formatNumber(Math.abs(current_h_prime))} cm`, rationale: `Đầu tiên tính d' = $(f \\times d) / (d - f) = (${currentF} \\times ${currentD}) / (${currentD} - ${currentF}) = ${formatNumber(current_d_prime)} \\text{ cm}$. Sau đó, dùng công thức độ phóng đại: $|h'| = h \\times |d'/d| = ${currentH} \\times |${formatNumber(current_d_prime)} / ${currentD}| = ${formatNumber(Math.abs(current_h_prime))} \\text{ cm}$.`, isCorrect: true },
            { text: `${formatNumber(Math.abs(current_h_prime) / 2)} cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false },
            { text: `${formatNumber(Math.abs(current_h_prime) + 5)} cm`, rationale: "Đây là kết quả sai, hãy kiểm tra lại công thức hoặc tính toán.", isCorrect: false },
            { text: `${formatNumber(currentH)} cm`, rationale: "Đây là chiều cao vật, không phải chiều cao ảnh.", isCorrect: false }
        ];
        // Handle infinity case for h'
        if (current_h_prime === Infinity) {
            q2_options = [
                { text: `Vô cực`, rationale: `Khi ảnh ở vô cực, chiều cao ảnh cũng là vô cực.`, isCorrect: true },
                { text: `Không xác định`, rationale: "Đây là cách diễn đạt không chính xác cho trường hợp này.", isCorrect: false },
                { text: `0 cm`, rationale: "Đây là kết quả sai.", isCorrect: false },
                { text: `${formatNumber(currentH)} cm`, rationale: "Đây là chiều cao vật, không phải chiều cao ảnh.", isCorrect: false }
            ];
        }
        q2_options.sort(() => Math.random() - 0.5);
        generatedQuizQuestions.push({
            question: `Với vật cao ${currentH} cm, khoảng cách vật là ${currentD} cm và tiêu cự là ${currentF} cm, chiều cao của ảnh (h') là bao nhiêu?`,
            answerOptions: q2_options,
            hint: "Để tính chiều cao ảnh, bạn cần biết khoảng cách ảnh trước. Sau đó dùng công thức độ phóng đại."
        });

        // Question 3: Characteristics based on current sliders
        const characteristicOptions = [
            "Ảnh thật, ngược chiều, nhỏ hơn vật",
            "Ảnh thật, ngược chiều, bằng vật",
            "Ảnh thật, ngược chiều, lớn hơn vật",
            "Ảnh ảo, cùng chiều, lớn hơn vật",
            "Ảnh ở vô cực"
        ];
        
        let actualCharacteristicOptions = [...characteristicOptions];
        if (current_d_prime === Infinity) {
            actualCharacteristicOptions = ["Ảnh ở vô cực"];
        } else {
            actualCharacteristicOptions = characteristicOptions.filter(opt => opt !== "Ảnh ở vô cực");
        }

        let shuffledOptions3 = [...actualCharacteristicOptions].sort(() => Math.random() - 0.5);
        // Ensure the correct answer is always one of the options
        if (!shuffledOptions3.includes(current_characteristics)) {
            // If the correct characteristic isn't in the shuffled options, add it
            if (shuffledOptions3.length >= 4) { // Make sure there's space for 4 options
                shuffledOptions3.pop(); // Remove one random to make space if needed
            }
            shuffledOptions3.push(current_characteristics);
            shuffledOptions3.sort(() => Math.random() - 0.5);
        }
        
        generatedQuizQuestions.push({
            question: `Với khoảng cách vật là ${currentD} cm và tiêu cự là ${currentF} cm, đặc điểm của ảnh tạo thành là gì?`,
            answerOptions: shuffledOptions3.map(opt => ({
                text: opt,
                rationale: `Đặc điểm của ảnh được xác định dựa trên vị trí vật so với tiêu cự và 2f. Trong trường hợp này, kết quả tính toán cho thấy ảnh là "${current_characteristics}".`,
                isCorrect: opt === current_characteristics
            })),
            hint: "Hãy nhớ các trường hợp tạo ảnh đặc biệt của thấu kính hội tụ dựa vào vị trí vật so với f và 2f."
        });

        // Random Questions
        const randomQuestionsPool = [
            // Question 4: Characteristics for d > 2f
            {
                question: `Khi vật đặt ở vị trí $d > 2f$ (ngoài 2f) của thấu kính hội tụ, ảnh tạo thành có đặc điểm gì?`,
                answerOptions: [
                    { text: "Ảnh thật, ngược chiều, nhỏ hơn vật", rationale: "Khi vật đặt ngoài 2f ($d > 2f$), ảnh là ảnh thật, ngược chiều và nhỏ hơn vật.", isCorrect: true },
                    { text: "Ảnh thật, ngược chiều, lớn hơn vật", rationale: "Sai, trường hợp này là khi $f < d < 2f$.", isCorrect: false },
                    { text: "Ảnh ảo, cùng chiều, lớn hơn vật", rationale: "Sai, trường hợp này là khi $d < f$.", isCorrect: false },
                    { text: "Ảnh ở vô cực", rationale: "Sai, trường hợp này là khi $d = f$.", isCorrect: false }
                ],
                hint: "Nghĩ về quy tắc hình thành ảnh khi vật ở rất xa thấu kính."
            },
            // Question 5: Characteristics for d = f
            {
                question: `Khi vật đặt tại tiêu điểm ($d = f$) của thấu kính hội tụ, ảnh tạo thành có đặc điểm gì?`,
                answerOptions: [
                    { text: "Ảnh ở vô cực", rationale: "Khi vật đặt tại tiêu điểm ($d = f$), ảnh tạo thành ở vô cực.", isCorrect: true },
                    { text: "Ảnh thật, ngược chiều, bằng vật", rationale: "Sai, trường hợp này là khi $d = 2f$.", isCorrect: false },
                    { text: "Ảnh ảo, cùng chiều, lớn hơn vật", rationale: "Sai, trường hợp này là khi $d < f$.", isCorrect: false },
                    { text: "Không có ảnh", rationale: "Sai, ảnh vẫn được tạo thành nhưng ở vô cực.", isCorrect: false }
                ],
                hint: "Xem xét khi các tia sáng khúc xạ qua thấu kính hội tụ mà đi song song."
            },
            // Question 6: Characteristics for d < f
            {
                question: `Khi vật đặt ở vị trí $d < f$ (trong khoảng tiêu cự) của thấu kính hội tụ, ảnh tạo thành có đặc điểm gì?`,
                answerOptions: [
                    { text: "Ảnh thật, ngược chiều, lớn hơn vật", rationale: "Sai, đây là đặc điểm của ảnh khi vật đặt giữa f và 2f.", isCorrect: false },
                    { text: "Ảnh ảo, cùng chiều, lớn hơn vật", rationale: "Khi vật đặt trong khoảng tiêu cự ($d < f$), ảnh tạo thành là ảnh ảo, cùng chiều và lớn hơn vật.", isCorrect: true },
                    { text: "Ảnh thật, ngược chiều, nhỏ hơn vật", rationale: "Sai, đây là đặc điểm của ảnh khi vật đặt ngoài 2f.", isCorrect: false },
                    { text: "Ảnh bằng vật", rationale: "Sai, ảnh bằng vật chỉ xảy ra khi vật đặt tại 2f.", isCorrect: false }
                ],
                hint: "Xem xét khi nào thấu kính hội tụ tạo ảnh ảo."
            },
            // Question 7: Characteristics for f < d < 2f
            {
                question: `Khi vật đặt ở vị trí $f < d < 2f$ (giữa f và 2f) của thấu kính hội tụ, ảnh tạo thành có đặc điểm gì?`,
                answerOptions: [
                    { text: "Ảnh thật, ngược chiều, lớn hơn vật", rationale: "Khi vật đặt giữa f và 2f ($f < d < 2f$), ảnh tạo thành là ảnh thật, ngược chiều và lớn hơn vật.", isCorrect: true },
                    { text: "Ảnh thật, ngược chiều, nhỏ hơn vật", rationale: "Sai, đây là đặc điểm của ảnh khi vật đặt ngoài 2f.", isCorrect: false },
                    { text: "Ảnh ảo, cùng chiều, lớn hơn vật", rationale: "Sai, đây là đặc điểm của ảnh khi vật đặt trong khoảng tiêu cự.", isCorrect: false },
                    { text: "Ảnh bằng vật", rationale: "Sai, ảnh bằng vật chỉ xảy ra khi vật đặt tại 2f.", isCorrect: false }
                ],
                hint: "Nghĩ về cách độ phóng đại thay đổi khi vật di chuyển giữa f và 2f."
            },
             // Question 8: Definition of Focal Length
             {
                question: `Tiêu cự (f) của một thấu kính hội tụ là gì?`,
                answerOptions: [
                    { text: "Khoảng cách từ quang tâm đến tiêu điểm chính.", rationale: "Tiêu cự là khoảng cách từ quang tâm của thấu kính đến tiêu điểm chính của nó.", isCorrect: true },
                    { text: "Khoảng cách từ vật đến ảnh.", rationale: "Sai, đây là khoảng cách vật - ảnh.", isCorrect: false },
                    { text: "Chiều cao của vật.", rationale: "Sai, đây là chiều cao vật.", isCorrect: false },
                    { text: "Khoảng cách từ thấu kính đến màn chắn.", rationale: "Sai, đây có thể là khoảng cách ảnh d'.", isCorrect: false }
                ],
                hint: "Nhớ lại định nghĩa cơ bản về tiêu cự."
            }
        ];

        // Shuffle the random questions pool and pick 2 unique ones
        const shuffledRandomQuestions = randomQuestionsPool.sort(() => Math.random() - 0.5);
        const selectedRandomQuestions = shuffledRandomQuestions.slice(0, 2);

        // Add the selected random questions
        selectedRandomQuestions.forEach(q => {
            q.answerOptions.sort(() => Math.random() - 0.5); // Shuffle options for random questions
            generatedQuizQuestions.push(q);
        });

        quizQuestionsDiv.innerHTML = ''; // Clear previous questions
        quizResultParagraph.textContent = ''; // Clear quiz result

        generatedQuizQuestions.forEach((qData, index) => {
            const questionItem = document.createElement('div');
            questionItem.classList.add('question-item');
            questionItem.innerHTML = `
                <p><strong>Câu ${index + 1}:</strong> ${qData.question}</p>
                <div class="options" id="options-q${index}">
                    ${qData.answerOptions.map((option, optIndex) => `
                        <label>
                            <input type="radio" name="q${index}" value="${option.text}"> ${option.text}
                        </label><br>
                    `).join('')}
                </div>
                <button class="show-hint-button" data-hint="${qData.hint}">Hiện gợi ý</button>
                <p class="hint-text" id="hint-q${index}" style="display:none; font-style: italic; color: #aaa; margin-top: 5px;"></p>
                <p class="question-result" id="result-q${index}"></p>
                <p class="rationale-text" id="rationale-q${index}" style="display:none; font-style: italic; color: #88B04B; margin-top: 5px;"></p>
            `;
            quizQuestionsDiv.appendChild(questionItem);
        });

        // Add event listeners for "Show Hint" buttons
        document.querySelectorAll('.show-hint-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const hintTextElement = event.target.nextElementSibling; // The hint-text paragraph
                hintTextElement.innerHTML = event.target.dataset.hint; // Changed from textContent to innerHTML
                hintTextElement.style.display = 'block';
                // Call MathJax to process the formula in the hint
                if (typeof MathJax !== 'undefined') {
                    MathJax.typesetPromise([hintTextElement]);
                }
            });
        });

        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([quizQuestionsDiv]).then(() => {
                console.log('MathJax typeset completed for quiz content.');
            });
        }
    }


    // Quiz check function
    window.checkQuiz = function() {
        let allCorrect = true;
        let numCorrect = 0;

        generatedQuizQuestions.forEach((qData, index) => {
            const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
            const resultSpan = document.getElementById(`result-q${index}`);
            const rationaleSpan = document.getElementById(`rationale-q${index}`);
            const hintTextElement = document.getElementById(`hint-q${index}`);

            // Hide hint if it was shown
            hintTextElement.style.display = 'none';

            if (!selectedOption) {
                resultSpan.textContent = "Vui lòng chọn một đáp án.";
                resultSpan.style.color = '#FFD700';
                rationaleSpan.style.display = 'none'; // Hide rationale if no selection
                allCorrect = false;
            } else {
                const selectedAnswerText = selectedOption.value;
                const correctAnswerObj = qData.answerOptions.find(opt => opt.isCorrect);

                if (selectedAnswerText === correctAnswerObj.text) {
                    resultSpan.textContent = "Chính xác!";
                    resultSpan.style.color = '#4CAF50';
                    numCorrect++;
                } else {
                    resultSpan.textContent = "Chưa chính xác.";
                    resultSpan.style.color = '#FF6347';
                    allCorrect = false;
                }
                rationaleSpan.textContent = `Lời giải: ${correctAnswerObj.rationale}`;
                rationaleSpan.style.display = 'block';
            }
        });

        const quizResultOverall = document.getElementById('quizResult');
        if (allCorrect) {
            quizResultOverall.textContent = `Hoàn hảo! Bạn đã trả lời đúng ${numCorrect}/${generatedQuizQuestions.length} câu.`;
            quizResultOverall.style.color = '#4CAF50';
        } else {
            quizResultOverall.textContent = `Bạn đã trả lời đúng ${numCorrect}/${generatedQuizQuestions.length} câu. Hãy xem lại các câu trả lời sai nhé!`;
            quizResultOverall.style.color = '#FF6347';
        }

        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([quizQuestionsDiv]).then(() => {
                console.log('MathJax typeset completed for quiz rationale.');
            });
        }
    };

    // --- Hàm xuất DOCX mới ---
    async function exportDocx() {
        const docx = window.docx; // Lấy đối tượng docx từ global scope
        if (!docx) {
            alert("Thư viện docx chưa được tải. Vui lòng thử lại sau.");
            return;
        }

        const d = currentD;
        const h = currentH;
        const f = currentF;
        const { d_prime, h_prime, characteristics } = calculateImageProperties(d, h, f);

        // Helper to clean LaTeX delimiters and symbols for DOCX
        const cleanLaTeX = (text) => {
            return text.replace(/\$\$/g, '').replace(/\$/g, '').replace(/\\text{([^}]+)}/g, '$1').replace(/\\left\(/g, '(').replace(/\\right\)/g, ')').replace(/\\cdot/g, ' x ').replace(/\\times/g, ' x ').replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)').replace(/\\infty/g, 'Vô cực');
        };

        // Chuẩn bị nội dung cho đề bài và lời giải
        const problemStatement = [
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: "Bài toán thấu kính hội tụ", bold: true, size: 36 }),
                ],
                alignment: docx.AlignmentType.CENTER,
                spacing: { after: 200 },
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: "Đề bài:", bold: true, size: 28 }),
                ],
                spacing: { after: 100 },
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Cho một vật sáng AB đặt trước thấu kính hội tụ.`),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Khoảng cách từ vật đến thấu kính (d): ${d} cm`),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Chiều cao vật (h): ${h} cm`),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Tiêu cự của thấu kính (f): ${f} cm`),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Yêu cầu: Tính khoảng cách ảnh (d'), chiều cao ảnh (h') và nêu đặc điểm của ảnh.`),
                ],
                spacing: { after: 400 },
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: "Lời giải chi tiết:", bold: true, size: 28 }),
                ],
                spacing: { after: 100 },
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: "1. Công thức thấu kính:", bold: true }),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Sử dụng công thức thấu kính mỏng:"),
                ],
            }),
            // LaTeX for 1/f = 1/d + 1/d'
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: cleanLaTeX("1/f = 1/d + 1/d'"), size: 22 }),
                ],
                alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Trong đó:"),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`• f: tiêu cự của thấu kính (${f} cm)`),
                ],
                bullet: { level: 0 }
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`• d: khoảng cách từ vật đến thấu kính (${d} cm)`),
                ],
                bullet: { level: 0 }
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`• d': khoảng cách từ ảnh đến thấu kính`),
                ],
                bullet: { level: 0 }
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Từ đó, ta có thể suy ra d':"),
                ],
            }),
            // LaTeX for 1/d' = 1/f - 1/d
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: cleanLaTeX("1/d' = 1/f - 1/d = (d - f) / (f \\times d)"), size: 22 }),
                ],
                alignment: docx.AlignmentType.CENTER,
            }),
            // LaTeX for d' = (f*d)/(d-f)
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: cleanLaTeX("d' = (f \\times d) / (d - f)"), size: 22 }),
                ],
                alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Thay số vào: d' = (${f} x ${d}) / (${d} - ${f}) = ${formatNumber(d_prime)} cm`),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: "2. Công thức độ phóng đại:", bold: true }),
                ],
                spacing: { before: 200 },
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Sử dụng công thức độ phóng đại:"),
                ],
            }),
            // LaTeX for k = h'/h = -d'/d
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: cleanLaTeX("k = h'/h = -d'/d"), size: 22 }),
                ],
                alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Trong đó:"),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`• k: độ phóng đại`),
                ],
                bullet: { level: 0 }
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`• h: chiều cao của vật (${h} cm)`),
                ],
                bullet: { level: 0 }
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`• h': chiều cao của ảnh`),
                ],
                bullet: { level: 0 }
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Từ đó, ta có thể suy ra h':"),
                ],
            }),
            // LaTeX for h' = h * (-d'/d)
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: cleanLaTeX("h' = h \\times (-d'/d)"), size: 22 }),
                ],
                alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun(`Thay số vào: h' = ${h} x (-${formatNumber(d_prime)}/${d}) = ${formatNumber(h_prime)} cm`),
                ],
            }),
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: "3. Đặc điểm của ảnh:", bold: true }),
                ],
                spacing: { before: 200 },
            }),
        ];

        if (d_prime > 0) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì d' > 0, ảnh tạo thành là ảnh thật.")], bullet: { level: 0 } }));
        } else if (d_prime < 0) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì d' < 0, ảnh tạo thành là ảnh ảo.")], bullet: { level: 0 } }));
        } else {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì d' = Vô cực, ảnh tạo thành là ảnh ở vô cực.")], bullet: { level: 0 } }));
        }

        if (h_prime < 0) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì h' có dấu ngược với h (do h_{gốc} là dương và h' âm), ảnh ngược chiều với vật.")], bullet: { level: 0 } }));
        } else if (h_prime > 0) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì h' và h cùng dấu, ảnh cùng chiều với vật.")], bullet: { level: 0 } }));
        } else if (d_prime !== Infinity) { // Only add if not infinity to avoid duplicate "infinity"
             problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Không xác định chiều cao ảnh vì ảnh ở vô cực.")], bullet: { level: 0 } }));
        }

        if (Math.abs(h_prime) < h) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì |h'| < h, ảnh nhỏ hơn vật.")], bullet: { level: 0 } }));
        } else if (Math.abs(h_prime) > h) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì |h'| > h, ảnh lớn hơn vật.")], bullet: { level: 0 } }));
        } else if (Math.abs(h_prime) === h && d_prime !== Infinity) {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Vì |h'| = h, ảnh bằng vật.")], bullet: { level: 0 } }));
        } else {
            problemStatement.push(new docx.Paragraph({ children: [new docx.TextRun("• Không xác định kích thước ảnh vì ảnh ở vô cực.")], bullet: { level: 0 } }));
        }
        problemStatement.push(new docx.Paragraph({
            children: [
                new docx.TextRun(`Tóm lại: ${characteristics}.`),
            ],
            spacing: { after: 400 },
        }));

        // --- Thêm 5 câu hỏi trắc nghiệm ---
        problemStatement.push(new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "Các câu hỏi trắc nghiệm:", bold: true, size: 28 }),
            ],
            spacing: { after: 200 },
        }));

        // Call generateQuizQuestions to ensure generatedQuizQuestions is populated
        // if it hasn't been already by clicking "Câu hỏi hiểu bài"
        if (generatedQuizQuestions.length === 0) {
            generateQuizQuestions(); // Generate questions if not already
        }

        // We need 5 questions in total. We already generate 3 fixed and 2 random.
        // If generateQuizQuestions is called, generatedQuizQuestions will have 5 questions.
        for (let i = 0; i < generatedQuizQuestions.length; i++) {
            const q = generatedQuizQuestions[i];
            problemStatement.push(new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: `Câu ${i + 1}: ${cleanLaTeX(q.question)}`, bold: true }),
                ],
                spacing: { after: 100 },
            }));
            q.answerOptions.forEach((option, optIndex) => {
                const prefix = String.fromCharCode(65 + optIndex) + ". "; // A., B., C., D.
                problemStatement.push(new docx.Paragraph({
                    children: [
                        new docx.TextRun(`${prefix}${cleanLaTeX(option.text)}`),
                    ],
                    spacing: { after: 50 },
                }));
            });
            // Add rationale as solution for quiz questions
            const correctAnswer = q.answerOptions.find(opt => opt.isCorrect);
            if (correctAnswer) {
                 problemStatement.push(new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: `Lời giải: ${cleanLaTeX(correctAnswer.text)} - ${cleanLaTeX(correctAnswer.rationale)}`, bold: true, color: "#4CAF50" }),
                    ],
                    spacing: { after: 200 },
                }));
            }
        }

        const doc = new docx.Document({
            sections: [{
                children: problemStatement,
            }],
        });

        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, "BaiTapThauKinh_KHTN9.docx");
            alert("Đã xuất file Word thành công!");
        }).catch(error => {
            console.error("Lỗi khi xuất file Word:", error);
            alert("Có lỗi xảy ra khi xuất file Word. Vui lòng kiểm tra console để biết thêm chi tiết.");
        });
    }

    // Event listeners for sliders
    objectDistanceSlider.addEventListener('input', updateSimulation);
    objectHeightSlider.addEventListener('input', updateSimulation);
    focalLengthSlider.addEventListener('input', updateSimulation);

    // Event listener for "Hiển thị lời giải" button
    showSolutionButton.addEventListener('click', () => {
        solutionModal.style.display = 'flex';
    });

    // Event listener for "Thông tin ảnh" button
    showImageInfoButton.addEventListener('click', () => {
        imageInfoSectionDiv.style.display = 'block'; // Show the image info section (Vùng 4)
        quizSectionDiv.style.display = 'none'; // Hide the quiz section (Vùng 5)
        showImageInfo(); // Make sure image info content is visible and note is hidden
    });

    // Event listener for "Câu hỏi hiểu bài" button
    showQuizButton.addEventListener('click', () => {
        quizSectionDiv.style.display = 'block';
        generateQuizQuestions(); // Generate questions when the section is shown
        // Hide image info/note
        imageInfoSectionDiv.style.display = 'none'; // Make sure image info is hidden
        quizResultParagraph.textContent = ''; // Clear overall quiz result when opening
        
        // Clear previous selections and results for quiz
        document.querySelectorAll('input[name^="q"]:checked').forEach(radio => {
            radio.checked = false;
        });
        document.querySelectorAll('.question-result').forEach(span => {
            span.textContent = '';
        });
        document.querySelectorAll('.rationale-text').forEach(span => {
            span.textContent = '';
            span.style.display = 'none';
        });
        document.querySelectorAll('.hint-text').forEach(span => {
            span.textContent = '';
            span.style.display = 'none';
        });
    });

    // Event listener for "Cập nhật câu hỏi" button inside the quiz section
    updateQuizButton.addEventListener('click', () => {
        generateQuizQuestions(); // Regenerate quiz questions
        quizResultParagraph.textContent = ''; // Clear overall quiz result
        // Clear individual question results and uncheck radio buttons
        document.querySelectorAll('input[name^="q"]:checked').forEach(radio => {
            radio.checked = false;
        });
        document.querySelectorAll('.question-result').forEach(span => {
            span.textContent = '';
        });
        document.querySelectorAll('.rationale-text').forEach(span => {
            span.textContent = '';
            span.style.display = 'none';
        });
        document.querySelectorAll('.hint-text').forEach(span => {
            span.textContent = '';
            span.style.display = 'none';
        });
    });

    // Event listener for the new export button
    exportDocxButton.addEventListener('click', exportDocx);

    // Modal close listeners
    closeButton.addEventListener('click', () => {
        solutionModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === solutionModal) {
            solutionModal.style.display = 'none';
        }
    });

    // Initial update when page loads
    updateSimulation();
    // Ensure that image info is hidden and initial note is shown on load
    hideImageInfo(); 
    solutionModal.style.display = 'none'; // Ensure modal is hidden on load
});