import React from 'react';
import { Form, Radio, Button, Checkbox, Table, Grid, Dimmer, Card, Message } from 'semantic-ui-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// components
import LandingPage from './LandingPage';
import Step from './Step';
import PlannerSheet from './PlannerSheet';

// data
import CSCourses from './CSCourses';
import OtherCourses from './OtherCourses';

class MainForm extends React.Component {
	constructor(props) {
		super(props);
		const date = new Date();
		const semester = (date.getMonth() <= 5) ? 'spring' : 'fall';
		
		var csCourses = {};
		CSCourses.courses.forEach((course) => {
			const name = course.subject + course.number;	
			csCourses[name] = {taken: false, subject: course.subject, number: course.number, title: course.title};
		});

		var otherCourses = {};	
		OtherCourses.courses.forEach((course) => {
			const name = course.subject + course.number;	
			otherCourses[name] = {taken: false, subject: course.subject, number: course.number, title: course.title};
		});

		// create templateSemester
		var fall_start_year = (date.getMonth() <= 5) ? date.getFullYear() - 1 : date.getFullYear();
		var spring_start_year = fall_start_year + 1;	
		const current_year = new Date().getFullYear();
		var scheduleTemplate = new Array(4);	
		for(let i=0; i<4; i++) { // freshman, sophomore, junior, senior
			let yFall = fall_start_year + i; // year of that semester
			let ySpring = spring_start_year + i;
			
			const isFallCurrentSemester = (yFall === current_year && semester === 'fall');		
			const isSpringCurrentSemester = (ySpring === current_year && semester === 'spring');

			const freeFall = (yFall < current_year || isFallCurrentSemester) ? false : true;
			const freeSpring = (ySpring < current_year || isSpringCurrentSemester) ? false : true;
		
			scheduleTemplate[i] = new Array(2);
			scheduleTemplate[i][0] = {semester: 'fall', year: yFall, free: freeFall, courses: []};
			scheduleTemplate[i][1] = {semester: 'spring', year: ySpring, free: freeSpring, courses: []};
		}

		this.state = {
			step: 0,
			percent: 0,
			currentSemester: semester,
			year: 'freshman',
			yearInt: 0,
			fall_start_year: fall_start_year,
			semester: semester,
			genEdsNum: 0,
			csElectivesNum: 0,
			csCourses: Object.assign({}, csCourses),
			otherCourses: Object.assign({}, otherCourses),
			selectedSemester: semester,
			selectedYear: date.getFullYear(),
			scheduleTemplate: scheduleTemplate, // blank schedule that marks free semesters 
			abroadCourses: []
		};

		// bind methods to 'this'
		this.nextStep = this.nextStep.bind(this);
		this.prevStep = this.prevStep.bind(this);
		
		this.handleYear = this.handleYear.bind(this);
		this.handleGenEds = this.handleGenEds.bind(this);
		this.handleCSCourse = this.handleCSCourse.bind(this);
		this.handleCSElectives = this.handleCSElectives.bind(this);

		this.handleOtherCourse = this.handleOtherCourse.bind(this);
		this.handleSemester = this.handleSemester.bind(this);

		// generates schedules where the study abroad-able classes are in the selectedSemester	
		this.getScheduleTable = this.getScheduleTable.bind(this);
		this.getGridRow = this.getGridRow.bind(this);
	}

	nextStep() {
		const step = this.state.step;
		const percent = (step === 0) ? -16 : this.state.percent;
		this.setState({
			step: step + 1,	
			percent: percent >= 100 ? 100 : percent + 16
		});
	}

	prevStep() {
		const step = this.state.step;
		const percent = this.state.percent;
		this.setState({
			step: step - 1,
			percent: percent <= 0 ? 0 : percent - 16
		});
	}

	handleYear = (event, data) => {
		var yearInt;
		switch(data.value) {
			case 'freshman':
				yearInt = 0;
				break;
			case 'sophomore':
				yearInt = 1;
				break;
			case 'junior':
				yearInt = 2;
				break;
			case 'senior':
				yearInt = 3;
				break;
			default:
				yearInt = 0;
				break;
		}

		// calculate when freshman year, fall semester
		var fall_start_year = (new Date()).getFullYear();
		for(let i=yearInt; i>0; i--) {	
			fall_start_year--;
		}
		if(this.state.semester === 'spring') fall_start_year--;

		var csCourses = {...this.state.csCourses};	
		for(var course in csCourses) {
			const courseNum = csCourses[course].number;
			const courseLevel = Number( String(courseNum).charAt(0) );
			const defaultChecked = (courseLevel < (yearInt + 1)) ? true : false;	
			csCourses[course].taken = defaultChecked;
		}

		// update templateSemester
		var spring_start_year = fall_start_year + 1;	
		const current_year = new Date().getFullYear();
		var scheduleTemplate = new Array(4);	
		for(let i=0; i<4; i++) { // freshman, sophomore, junior, senior
			let yFall = fall_start_year + i; // year of that semester
			let ySpring = spring_start_year + i;
			
			const isFallCurrentSemester = (yFall === current_year && this.state.currentSemester === 'fall');		
			const isSpringCurrentSemester = (ySpring === current_year && this.state.currentSemester === 'spring');

			const freeFall = (yFall < current_year || isFallCurrentSemester) ? false : true;
			const freeSpring = (ySpring < current_year || isSpringCurrentSemester) ? false : true;
		
			scheduleTemplate[i] = new Array(2);
			scheduleTemplate[i][0] = {semester: 'fall', year: yFall, free: freeFall, courses: []};
			scheduleTemplate[i][1] = {semester: 'spring', year: ySpring, free: freeSpring, courses: []};
		}
			
		this.setState({
			year: data.value,
			yearInt: yearInt,
			fall_start_year: fall_start_year,
			csCourses: csCourses,
			scheduleTemplate: scheduleTemplate
		});
	}

	handleGenEds = (sliderValue) => {
		this.setState({
			genEdsNum: sliderValue
		});	
	}

	handleCSCourse(event) {			
		const selectedCourse = event.target.id;	
		var csCourses = {...this.state.csCourses};		
		const checked = csCourses[selectedCourse].taken;
		for(var course in csCourses) {
			if(course === selectedCourse) csCourses[course].taken = !checked;
		}

		this.setState({
			csCourses: Object.assign({}, csCourses)
		});		
	}

	handleCSElectives = (sliderValue) => {
		this.setState({
			csElectivesNum: sliderValue
		});	
	}

	handleOtherCourse(event) {			
		const selectedCourse = event.target.id;	
		var otherCourses = {...this.state.otherCourses};		
		const checked = otherCourses[selectedCourse].taken;
		for(var course in otherCourses) {
			if(course === selectedCourse) otherCourses[course].taken = !checked;
		}

		this.setState({
			otherCourses: Object.assign({}, otherCourses)
		});		
	}

	handleSemester(enableDim, semester, year) {
		if(enableDim) return;

		this.setState({
			selectedSemester: semester,
			selectedYear: year
		});
	}

	// for SelectSemester
	// rewrite so this uses this.state.scheduleTemplate instead ; because this function recalculates the same thing
	getGridRow(semester, start_year) {
		var cells = [];
		for(let i=0; i<4; i++) {
			cells.push(`${semester}`);
		}
	
		cells = cells.map( (semester, index) => {
			let y = start_year + index; // year of that semester
			const current_year = new Date().getFullYear();
			const isCurrentSemester = (y === current_year && this.state.currentSemester === semester);		
			const enableDim = (y < current_year || isCurrentSemester) ? true : false;

			return(
				<Grid.Column
					key={semester + y}
					onClick={() => this.handleSemester(enableDim, semester, y)}	
				>
					
					<Dimmer.Dimmable>	
						<Dimmer active={enableDim} inverted />	
						<Card
							description={semester.charAt(0).toUpperCase() + semester.slice(1) + ' ' + y}
							onClick={() => this.handleSemester(enableDim, semester, y)}
							color={(this.state.selectedSemester === (semester) && (this.state.selectedYear === y) && !enableDim ? 'green' : undefined)}
						/>
					</Dimmer.Dimmable>
				</Grid.Column>
			);
		});
	
		return(
			<Grid.Row>
				{cells}
			</Grid.Row>
		);
	}

	getScheduleTable() {
		// get the study abroad-able classes: CS electives, gen eds, and other requirement classes (math)	
		let abroadCourses = [];	
		let BUCourses = [];
		let otherCourses = []; // courses that can be taken abroad... but it is preferred to take them at Bing
		const csElectivesNotTakenNum = 4 - this.state.csElectivesNum;
		const letters = ['A', 'B', 'A/B/C', 'A/B/C/D'];
		for(let i=0; i<csElectivesNotTakenNum; i++) {
			abroadCourses.push({placed: false, subject: "CS-Elective", number: letters[i], title: `CS elective ${i}`});
		}
		for(let i=0; i<this.state.genEdsNum; i++) {
			abroadCourses.push({placed: false, subject: "GEN-ED", number: i, title: 'Any general education course'});
		}
		for(let course in this.state.otherCourses) {
			let c = {...this.state.otherCourses[course]};	
			if(c.taken === false) {		
				c.placed = false;
				otherCourses.push(c);	
			} 
		}
		// and courses that must be taken at Binghamton University
		const csCourses = this.state.csCourses;
		for(let course in csCourses) {
			let c = {...csCourses[course]};
			if(c.taken) continue;
			else {
				c.placed = false;
				BUCourses.push(c);
			}
		}
	
		let schedule = [...this.state.scheduleTemplate]; // deep copy
		schedule = JSON.parse(JSON.stringify(schedule)); // deep copy

		var warnings = [];	
		var abroadSemesterIdx = 0;
		var abroadYearIdx = 0;
		let part1Placed = false;	
	
		// to check later if electives are taken after these are taken	
		var cs350 = {placed: false, semester: 0, year: 0};
		var cs375 = {placed: false, semester: 0, year: 0};

		for(let year=0; year<4; year++) { // freshman, sophomore, junior, senior
			for(let semester=0; semester<2; semester++) { // fall, spring	
				let thisSemester = schedule[year][semester];
				let thisSemesterStr = (semester === 0) ? 'fall' : 'spring';
				const isStudyAbroadSemester = (thisSemester.year === this.state.selectedYear && thisSemesterStr === this.state.selectedSemester);
				if(isStudyAbroadSemester) {
					abroadYearIdx = year;
					abroadSemesterIdx = semester;
					continue;
				}
				if(thisSemester.free === false) continue; // fill study abroad courses after
			
				// csCourses
				let placed = 0;
				for(let i=0; i<BUCourses.length; i++) {
					if(placed >= 2) break;
					let c = {...BUCourses[i]};
					if(c.placed === true) continue;
					
					if(c.number === 350) {
						cs350.placed = true;
						cs350.semester = semester;
						cs350.year = year;
					}
					if(c.number === 375) {
						cs375.placed = true;
						cs375.semester = semester;
						cs375.year = year;
					}

					thisSemester.courses.push(c);
					BUCourses[i].placed = true;
					placed++;
				}
				// other courses
				placed = 0;
				var part1PlacedInSemester = false;
				for(let i=0; i<otherCourses.length; i++) {
					if(placed === 2) break;
					let c = {...otherCourses[i]};
					if(c.placed === true) continue;
					if(c.subject === 'Science') {
						if(c.number !== (semester+1)) continue;
						if(part1PlacedInSemester === true) continue; // is science sequence I is placed, can't place science sequence II in the same semester
						if(c.number === 2 && part1Placed === false) continue; // must take part I before part II
					}
					thisSemester.courses.push(c);
					otherCourses[i].placed = true;
					placed++;
					if(c.subject === 'Science' && c.number === 1) {
						part1PlacedInSemester = true;
						part1Placed = true;
					}
				}
				// genEds, if there is room
				if(thisSemester.courses.length < 4) {
					for(let i=0; i<abroadCourses.length; i++) {
						if(thisSemester.courses.length === 4) break;
						let c = {...abroadCourses[i]};
						if(c.placed === true || c.subject === 'CS-Elective') continue;
						
						thisSemester.courses.push(c);
						abroadCourses[i].placed = true;
						placed++;
					}
				}
			}
		}

		// loop back again to add BUCourses to empty slots
		for(let year=0; year<4; year++) { // freshman, sophomore, junior, senior
			for(let semester=0; semester<2; semester++) { // fall, spring	
				let thisSemester = schedule[year][semester];
				let thisSemesterStr = (semester === 0) ? 'fall' : 'spring';
				const isStudyAbroadSemester = (thisSemester.year === this.state.selectedYear && thisSemesterStr === this.state.selectedSemester);
				if(thisSemester.free === false || isStudyAbroadSemester) continue; // fill study abroad courses after
				if(thisSemester.courses.length === 4) continue;
				
				// csCourses
				for(let i=0; i<BUCourses.length; i++) {
					let c = {...BUCourses[i]};
					if(c.placed === true) continue;
					if(thisSemester.courses.length === 4) continue;
						
					if(c.number === 350) {
						cs350.placed = true;
						cs350.semester = semester;
						cs350.year = year;
					}
					if(c.number === 375) {
						cs375.placed = true;
						cs375.semester = semester;
						cs375.year = year;
					}

					thisSemester.courses.push(c);
					BUCourses[i].placed = true;
				}
				
				// if there is room, try to get CS electives A and B in a BU slot
				if(thisSemester.courses.length < 4) {
					for(let i=0; i<abroadCourses.length; i++) {
						if(thisSemester.courses.length === 4) break;
						let c = {...abroadCourses[i]};
						if(c.placed === false && c.subject === 'CS-Elective') {
							if(c.number === 'A' || c.number === 'B') {
								thisSemester.courses.push(c);
								abroadCourses[i].placed = true;
							}	
						}	
					}
				}

			}
		}

		// check if all required courses were placed in the schedule
		for(let i=0; i<BUCourses.length; i++) {
			if(BUCourses[i].placed === false) {
				warnings.push("Could not fit all required CS courses.");
				break;
			}
		}	

		// add courses to study abroad semester
		var abroadSemester = schedule[abroadYearIdx][abroadSemesterIdx];
		if(abroadSemester.courses.length !== 0) console.log("Gibt es ein Problem! Should be empty...");
		
		for(let i=0; i<abroadCourses.length; i++) {
			if(abroadSemester.courses.length === 4) break;
			let c = {...abroadCourses[i]};
			if(c.placed === true) continue;

			abroadSemester.courses.push(c);
			abroadCourses[i].placed = true;
		}
		// place other courses here, if fits	
		for(let i=0; i<otherCourses.length; i++) {
			if(abroadSemester.courses.length === 4) break;
			let c = {...otherCourses[i]};
			if(c.placed === true) continue;

			abroadSemester.courses.push(c);
			abroadCourses[i].placed = true;
		}
		// check if all other courses were placed in the schedule
		for(let i=0; i<otherCourses.length; i++) {
			if(otherCourses[i].placed === false) {
				warnings.push("Could not fit all other required courses.");
				break;
			}
		}	

		/*
			var abroadSemesterIdx = 0;
			var abroadYearIdx = 0;
	
			// to check later if electives are taken after these are taken	
			var cs350 = {placed: false, semester: 0, year: 0};
			var cs375 = {placed: false, semester: 0, year: 0};

		 */
		// check if cs350 and cs375 were taken before the elective courses
		for(let i=0; i<abroadCourses.length; i++) {
			let course = abroadCourses[i];
			if(course.subject === 'CS-Elective') {
				if(abroadYearIdx < cs350.year || abroadYearIdx < cs375.year) {
					warnings.push('CS350 and CS375 must be taken before CS electives. Try picking a later semester for study abroad.');
					break;	
				}	
			}
		}	

		var tableRows = [];
		// generate each row of the table
		for(let semester=0; semester<2; semester++) { // fall, spring
			let semesterCells = [];
			let cells = []; // array of table cells
			for(let year=0; year<4; year++) { // freshman, sophomore, junior, senior	
				let s = schedule[year][semester];
				let courses = s.courses;
				courses = courses.map((c) => {
					const key = c.subject + c.number;
					return(<p key={key}>{key}</p>);	
				});
				let semesterCell = (
					<Table.Cell key={s.semester + s.year}>
						<i>{s.semester.charAt(0).toUpperCase() + s.semester.slice(1) + ' ' + s.year}</i>
					</Table.Cell>
				);
				let cell = (
					<Table.Cell key={s.semester + s.year}>	
						{courses}
					</Table.Cell>				
				);
				semesterCells.push(semesterCell);
				cells.push(cell);
			}
			let semesterRow = (
				<Table.Row key={'s' + semester}>
					{semesterCells}
				</Table.Row>				
			);
			let row = (
				<Table.Row key={'c' + semester}>
					{cells}
				</Table.Row>
			);
			tableRows.push(semesterRow);
			tableRows.push(row);
		}

		const table = (
			<Table celled striped>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell> Freshman </Table.HeaderCell>
						<Table.HeaderCell> Sophomore </Table.HeaderCell>
						<Table.HeaderCell> Junior </Table.HeaderCell>
						<Table.HeaderCell> Senior </Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{tableRows}
				</Table.Body>
			</Table>			
		);

		if(warnings.length > 0) {
			var allWarnings = warnings.map((w, index) => {
				return(<p key={index}>{w}</p>);
			});
			return(
				<div>
					<Message warning>
						<Message.Header>Uh oh. Conflicts were found in your schedule. </Message.Header>
						{allWarnings}
					</Message>
					{table}	
				</div>
			);
		}

		return(table);
	}

	render() {
		const step = this.state.step;	
		// each switch statement case is a page of the form
		let checkboxes = [];
		let choices;
		let selectedSemester = this.state.selectedSemester.charAt(0).toUpperCase() + this.state.selectedSemester.slice(1);
		switch(step) {
			
			case 0:
				return(
					<LandingPage
						onNextStep={this.nextStep}
					/>
				);
			case 1:
				const year = this.state.year;
				let years = (
						<Form>
							<Form.Group inline>
								<Form.Field>
									<Radio
										label='Freshman'
										value='freshman'
										checked={year === 'freshman'}
										onChange={this.handleYear}
									/>
								</Form.Field>
								<Form.Field>
									<Radio
										label='Sophomore'
										value='sophomore'
										checked={year === 'sophomore'}
										onChange={this.handleYear}
									/>
								</Form.Field>	
								<Form.Field>
									<Radio
										label='Junior'
										value='junior'
										checked={year === 'junior'}
										onChange={this.handleYear}
									/>
								</Form.Field>	
								<Form.Field>
									<Radio
										label='Senior'
										value='senior'
										checked={year === 'senior'}
										onChange={this.handleYear}
									/>
								</Form.Field>
							</Form.Group>	
						</Form>
				);

				return(
					<div>
					<Step
						percent={this.state.percent}
						question='What year are you?'
						description=''
						choices={years}
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>
					</div>	
				);
			case 2:
				const genEdSlider = (
					<Slider
						min={0}
						max={10}
						style={{marginTop: 50, marginBottom: 50}}
						defaultValue={this.state.genEdsNum}
						marks={{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10}}
						step={null}
						onChange={this.handleGenEds}
					/>
				);
				return(
					<Step
						percent={this.state.percent}
						question='How many general education courses do you still need to take?'
						description='You can view your courses on your Degree Works.
						Go to my.binghamton.edu and go to BU Brain. Click on the My Records tab and click Degree Works.'
						choices={genEdSlider}	
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>
				);
			case 3:
				// iterate the object
				let csCourses = {...this.state.csCourses};	
				for(let course in csCourses) {	
					const checked = csCourses[course].taken;
					let checkbox = (
						<Table.Row key={course}>
							<Table.Cell>
								<Checkbox
									id={course}
									label={course}
									key={course}
									checked={checked}
									onChange={this.handleCSCourse}	
								/>
							</Table.Cell>	
							<Table.Cell>
								<p>{csCourses[course].title}</p>	
							</Table.Cell>
						</Table.Row>
					);
					checkboxes.push(checkbox);
				}
				choices = (
					<Table>
						<Table.Body>
							{checkboxes}
						</Table.Body>
					</Table>
				);

				return(
					<Step
						percent={this.state.percent}
						question='Which computer science classes have you taken?'
						description='(Also select the classes that you are currently taking)'
						choices={choices}
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>
				);
			case 4:
				const csElectivesSlider = (
					<Slider
						min={0}
						max={4}
						style={{marginTop: 50, marginBottom: 50}}
						defaultValue={this.state.csElectivesNum}
						marks={{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4}}
						step={null}
						onChange={this.handleCSElectives}
					/>
				);
				
				return(
					<Step
						percent={this.state.percent}
						question='How many CS electives have you taken?'
						choices={csElectivesSlider}
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>				
				);

			case 5:
				let otherCourses = {...this.state.otherCourses};	
				for(let course in otherCourses) {	
					const checked = otherCourses[course].taken;
					let checkbox = (
						<Table.Row key={course}>
							<Table.Cell>
								<Checkbox
									id={course}
									label={course}
									key={course}
									checked={checked}
									onChange={this.handleOtherCourse}	
								/>
							</Table.Cell>	
							<Table.Cell>
								<p>{otherCourses[course].title}</p>	
							</Table.Cell>
						</Table.Row>
					);
					checkboxes.push(checkbox);
				}
				choices = (
					<Table>
						<Table.Body>
							{checkboxes}
						</Table.Body>
					</Table>
				);

				return(
					<Step
						percent={this.state.percent}
						question='Which other major requirements have you taken?'
						choices={choices}
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>
				);
			case 6:
				//this.handleScheduleTemplate();
				const fall = this.getGridRow("fall", this.state.fall_start_year);
				const spring = this.getGridRow("spring", this.state.fall_start_year + 1);
			
				choices = (
					<Grid columns={4}>
						<Grid.Row>
							<Grid.Column>Freshman</Grid.Column>	
							<Grid.Column>Sophomore</Grid.Column>	
							<Grid.Column>Junior</Grid.Column>	
							<Grid.Column>Senior</Grid.Column>	
						</Grid.Row>
						{fall}	
						{spring}
					</Grid>
				);

				return(
					<Step
						percent={this.state.percent}
						question='Select the semester you would like to study abroad.'
						choices={choices}
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>
				);
			case 7:	
				choices = this.getScheduleTable(); // generates schedules where study abroad-able classes are in the selectedSemester
				return(
					<Step
						percent={this.state.percent}
						question={`A guideline schedule for study abroad in ${selectedSemester} ${this.state.selectedYear}`}
						description={'It is possible to vary your schedule from this.'}
						choices={choices}
						onNextStep={this.nextStep}
						onPrevStep={this.prevStep}
					/>	
				);	
			case 8:
				return(
					<div>
						<PlannerSheet
							selectedSemester={selectedSemester}
							selectedYear={this.state.selectedYear}
						/>
						<Button onClick={this.prevStep}>Back</Button>	
					</div>
				);
			default:
				return(
					<div>
						<h1>Nothing to be found here...</h1>
						<Button onClick={this.prevStep}>Back</Button>
					</div>
				);	
		}
	}	
}

export default MainForm;
