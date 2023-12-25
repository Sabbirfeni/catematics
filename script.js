/* Cats */
const cats = [
  {
    id: 'cat_1',
    value: 1,
    image: 'images/kitten.png',
    class: 'kitten',
    enabled: true,
  },
  {
    id: 'cat_2',
    value: 5,
    image: 'images/cat_five_sm.png',
    class: 'cat',
    enabled: true,
  },
  {
    id: 'cat_3',
    value: 10,
    image: 'images/cat.png',
    class: 'cat',
    enabled: true,
  },
];

/* Question logic*/

/**
 * @returns array [string question, int answer]
 */
function generateQuestion() {
  var questionTypes = [
      generateAddition,
      generateSubtraction,
      generateMultiplication,
      generateSquare,
      generateSquareRoot,
      generateSimpleEquation
  ];

  // Randomly select a question type
  var generate = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  return generate();
}

function generateAddition() {
  var a = Math.floor(Math.random() * 16); // 0-15
  var b = 30 - a; // Ensures sum does not exceed 30
  return [a + " + " + b + " = ?", a + b];
}

function generateSubtraction() {
  var a = Math.floor(Math.random() * 22); // 0-21
  var b = Math.floor(Math.random() * (a + 1)); // Ensures result is non-negative
  return [a + " - " + b + " = ?", a - b];
}

function generateMultiplication() {
  var a = Math.floor(Math.random() * 11); // 0-10
  var b = Math.floor(Math.random() * 11); // 0-10
  return [a + " × " + b + " = ?", a * b];
}

function generateSquare() {
  var a = Math.floor(Math.random() * 10); // 0-9
  return [a + "² = ?", a * a];
}

function generateSquareRoot() {
  var a = Math.floor(Math.random() * 10); // 0-9
  return ["√" + (a * a) + " = ?", a];
}

function generateSimpleEquation() {
  // Randomly choose between addition and subtraction
  var equation = Math.random() > 0.5 ? generateAddition() : generateSubtraction();

  // equation is in the form of ["a +/- b", c]
  var operands = equation[0].split(' ');
  var result = equation[1];
  var replaceIndex = Math.random() > 0.5 ? 0 : 2; // Randomly choose to replace a (index 0) or b (index 2)

  // Replace chosen operand with 'x'
  var answer = parseInt(operands[replaceIndex]);
  operands[replaceIndex] = 'x';
  var question = operands.slice(0,3).join(' ') + " = " + result + "<br>What is x?";
  console.log(equation, operands, replaceIndex, answer)
  return [question, answer];
}

/* DOM manipulation */

$(document).ready(function() {
    let total = 0;
    let wins = localStorage.getItem('wins') ? parseInt(localStorage.getItem('wins'), 10) : 0;
    let question, answer;

    function newQuestion() {
      [question, answer] = generateQuestion();
      while(answer === 0) {
        [question, answer] = generateQuestion();
      }
      
      $('#question').html(question);
    }

    function make(cat, location) {
      const {id, value, image} = cat;

        // Create the div element with id and class
        var catDiv = $('<div>', {
            id,
        });

        // Create the image element with its source
        var catImg = $('<img>', {
            src: image,
        });

        catDiv.append(catImg);
        catDiv.draggable({revert:'invalid'})

      switch(location) {
        case 'home':
          // Add the div to the #catContainer
          // if there is $('#' + cat.id), then append catDiv to it; otherwise create it and append
          if ($('#' + cat.id + '_container').length) {
            $('#' + cat.id + '_container').append(catDiv);
          } else {
            const catContainer = $('<div>', {id: cat.id + '_container', class: 'cat-container'});
            catContainer.append(catDiv);
            $('#cats').append(catContainer);
          }
          break;
        case 'bucket':
          // Add the div to the #catContainer
          $('#bucket').append(catDiv);
          break;
        default:
          return;
      }
    }
  
  function addToBucket(cat) {
    make(cat, 'bucket');
    make(cat, 'home');
    
    total += cat.value;
    $('#total').text('').text(total);
  }
  
  function findCatById(id) {
    return cats.find(cat => cat.id === id);
  }

  function reset() {
      total = 0;
      $('#total').text('');
      $('#bucket').children().remove();
  }

  function skip() {
      reset();
      newQuestion();
  }
  
  function setWins(wins) {
      $('#win-count').text(wins);
      localStorage.setItem('wins', wins);
  }
   
  function resetWins() {
      wins = 0;
      setWins(0);
  }

    $('#bucket').droppable({
        drop: function(event, ui) {
            $('.instructions').remove();
            ui.draggable[0].remove();
            addToBucket(findCatById(ui.draggable[0].id))
        }
    });

    $('#submit').click(function() {
        if (total === answer) {
          alert('Correct! You are amazing!');
          setWins(++wins);
          reset();
          newQuestion();
        } else {
          alert('Whoah... That is not correct, let\'s try again.');
          reset();
        }
    });
  
    $('#reset').click(function() {
      reset();
    });
  
    $('#skip').click(function() {
      skip();
    });
    
    $('#score').click(function() {
        const resetConfirmed = confirm("Are you sure you want to reset the score?");
        if (resetConfirmed) {
            resetWins();
        }
    });
  
    setWins(wins);
    newQuestion();

    cats.sort((a, b) => b.value - a.value).forEach(cat => make(cat, 'home'));
});