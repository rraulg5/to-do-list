$(document).on('ready', function () {

	var tasks = getLocalStorage('todolist');
	loadTodoList();

	$('#txtTask').on('keydown', function (e) {
		if (e.keyCode === 13) { //If the key is Enter
			if ($(this).val() !== '') { //And is not empty
				$('#error').addClass('hidden');
				$('#btnAdd').trigger( "click" );
			} else {
				$('#error').removeClass('hidden');
			}
		}
	});

	$('#btnAdd').on('click', function() {
		var taskText = $('#txtTask').val(); //Get the task text

		if (taskText !== '') {

			$('#error').addClass('hidden');

			var taskObj  = {
				task_title: taskText,
				task_status: 'pending'
			};

			tasks.push(taskObj); //Add a new task in the array

			$('#txtTask').val(''); //Set the task text
			loadTodoList(); //Reload the to-do list
			setLocalStorage('todolist', tasks); //Save in local storage
		} else {
			$('#error').removeClass('hidden');
		}
	});

	$('#btnClear').on('click', function() {
		tasks = [];
		loadTodoList(); //Reload the to-do list
		setLocalStorage('todolist', tasks);//Update local storage
	});

	$('#todo-tasks').delegate('input:checkbox', 'click', function () {
		console.log('finished');
		var li = $(this).parent();
		var span = li.find('span');
		console.log(span);

		var id = li.data('id');

		//Update the status
		if (tasks[id].task_status === 'pending') {
			tasks[id].task_status = 'finished';
			span.addClass('done');
		} else {
			tasks[id].task_status = 'pending';
			span.removeClass('done');
		}
		
		setLocalStorage('todolist', tasks);//Update local storage
	});

	$('#todo-tasks').delegate('.delete', 'click' , function () {
		var li = $(this).parent();
		var id = li.data('id');

		li.fadeOut('slow'); //Hide the <li>
		tasks.splice(id,1); //Remove the task from the array
		setLocalStorage('todolist', tasks); //Update local storage
	});

	function getLocalStorage (key) {
		if (localStorage.getItem(key)) {
			return JSON.parse(localStorage.getItem(key));
		}

		return [];
	}

	function setLocalStorage (key, items) {
		localStorage.setItem(key, JSON.stringify(items));
	}

	function loadTodoList () {
		$('#todo-tasks li').remove(); // Clear to-do list

		tasks.forEach( function(value, index) {
			//console.log('task['+index+'] = '+value.title);
		});

		for (var i = 0; i < tasks.length; i++) {
			var spanClass = '';
			var checked = '';

			if (tasks[i].task_status === 'finished') {
				spanClass = 'done';
				checked = 'checked';
			}

			var li = '<li class="list-group-item" data-id="'+ i +'">';
			li += '<span class="' + spanClass + '">' + tasks[i].task_title + '</span>';
			li += '<span class="' + spanClass + ' delete pull-right"><i class="glyphicon glyphicon-remove-sign"/></span>'
			li += '<input class="finished pull-right" type="checkbox" ' + checked + '>';
			li += '</li>'

			$('#todo-tasks').append(li);
		}
	}
});