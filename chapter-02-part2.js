'use strict';
const get = id => document.getElementById(id);
function select(group, value) {
    document.querySelectorAll(`[data-${group}]`).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[group] === String(value))));
}
if (get('memory-diagram')) {
    function showMemory(kind) {
        select('memory', kind);
        const primitive = kind === 'primitive';
        get('memory-code').textContent = primitive ? 'int age = 20;\ndouble price = 19.5;' : 'int[] scores = {95, 88, 72};';
        get('memory-diagram').innerHTML = primitive
            ? '<div class="memory-box"><h3>Stack · local variables</h3><div class="memory-row"><code>age</code><code>20</code></div><div class="memory-row"><code>price</code><code>19.5</code></div></div><span class="memory-arrow" aria-hidden="true">→</span><div class="memory-box"><h3>Values stored directly</h3><p>No separate object is needed for these primitive values.</p></div>'
            : '<div class="memory-box"><h3>Stack · local variable</h3><div class="memory-row"><code>scores</code><code>ref A</code></div></div><span class="memory-arrow" aria-hidden="true">→</span><div class="memory-box heap"><h3>Heap · array object A</h3><div class="memory-row"><code>[95, 88, 72]</code></div><p>A is a teaching label, not a numeric address.</p></div>';
        get('memory-description').textContent = primitive ? 'A primitive variable holds the value itself.' : 'scores holds a reference to an array object. The array holds the int values.';
    }
    document.querySelectorAll('[data-memory]').forEach(button => button.addEventListener('click', () => showMemory(button.dataset.memory)));
    showMemory('primitive');
}
const types = {
    boolean: ['Not specified', 'false', 'true or false', 'boolean enrolled = true;', 'Two logical values; one bit of information does not imply one bit of storage.'],
    byte: ['8 bits', '0', '−128 to 127', 'byte level = 100;', 'Signed whole numbers in a small range.'],
    short: ['16 bits', '0', '−32,768 to 32,767', 'short seats = 1200;', 'Signed whole numbers with a wider range than byte.'],
    int: ['32 bits', '0', '−2,147,483,648 to 2,147,483,647', 'int population = 1500000;', 'The usual choice for whole-number calculations.'],
    long: ['64 bits', '0L', '−9,223,372,036,854,775,808 to 9,223,372,036,854,775,807', 'long distance = 3000000000L;', 'Use an uppercase L for a long literal beyond the int range.'],
    float: ['32 bits', '0.0f', 'Finite magnitudes: about 1.4 × 10⁻⁴⁵ to 3.4 × 10³⁸', 'float temperature = 21.5f;', 'IEEE 754 binary32: roughly 6–7 significant decimal digits. Also supports zero, negative values, infinities, and NaN.'],
    double: ['64 bits', '0.0d', 'Finite magnitudes: about 4.9 × 10⁻³²⁴ to 1.8 × 10³⁰⁸', 'double accountBalance = 1250.75;', 'IEEE 754 binary64: roughly 15–16 significant decimal digits. Also supports zero, negative values, infinities, and NaN. Decimal fractions may be approximate.'],
    char: ['16 bits', "'\\u0000'", '0 to 65,535 (U+0000 to U+FFFF)', "char grade = 'A';", 'An unsigned UTF-16 code unit. Some Unicode characters, including many emoji, require two char values.']
};
if (get('type-title')) {
    function inspect(name) {
        const [width, defaultValue, range, code, note] = types[name];
        select('type', name);
        get('type-title').textContent = name;
        get('type-width').textContent = width;
        get('type-default').textContent = defaultValue;
        get('type-range').textContent = range;
        get('type-code').textContent = code;
        get('type-note').textContent = note;
    }
    document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => inspect(button.dataset.type)));
    inspect('int');
}
if (get('lifecycle-code')) {
    const stages = [
        ['int studentScore;', 'studentScore : int', 'Not assigned', 'Declaration introduces a local variable name and type. Reading it now is a compile-time error.'],
        ['int studentScore;\nstudentScore = 95;\nSystem.out.println(studentScore); // 95', 'studentScore : int', '95', 'The first assignment gives studentScore its initial value. It is now safe to read.'],
        ['double accountBalance = 1250.75;\nSystem.out.println(accountBalance); // 1250.75', 'accountBalance : double', '1250.75', 'A separate example: declare and initialize another variable in one statement.']
    ];
    function showStage(index) {
        const [code, label, value, description] = stages[index];
        select('step', index);
        get('lifecycle-code').textContent = code;
        const name = document.createElement('code'); name.textContent = label;
        const stored = document.createElement('strong'); stored.textContent = value;
        get('lifecycle-slot').replaceChildren(name, stored);
        get('lifecycle-description').textContent = description;
    }
    document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => showStage(Number(button.dataset.step))));
    showStage(0);
}
