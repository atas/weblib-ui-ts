import * as React from 'react';

/**
 * Shows 1 to 5 stars
 * @param rating
 * @returns
 */
export function displayStars(rating: number) {
	const iconArr: any[] = [];

	for (let i = 0; i < 5; i++) {
		iconArr.push(getAStar(rating));
		rating -= 2;
	}

	return iconArr;
}

/**
 *
 * @param rating
 * @returns
 */
function getAStar(rating: number) {
	if (rating >= 2) {
		return (
			<span className="material-icons-outlined yellowStar" key={rating}>
				star
			</span>
		);
	} else if (rating === 1) {
		return (
			<span key={rating} className="material-icons-outlined yellowStar">
				star_half
			</span>
		);
	} else {
		return (
			<span key={rating} className="material-icons-outlined grayStar">
				star_border
			</span>
		);
	}
}
