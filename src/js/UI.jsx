import HistorySelector from "./ui/HistorySelector";

export default class UI {
	static initializeUI() {
		$('.button').button();
		HistorySelector.initializeTimeSelector();
	}
}

