export default {
	formatText(txt: string) {
		return txt.replace(/@\[@([^\]]+)]\(([0-9]+)\)/, '@$1');
	},
};
