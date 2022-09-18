import "./App.css";
import { useState, useEffect } from "react";
import * as math from "mathjs";
import React from "react";
import {
	XYPlot,
	XAxis,
	YAxis,
	HorizontalGridLines,
	LineSeries,
	VerticalBarSeries,
} from "react-vis";

function App() {
	const [equation, setEquation] = useState("x^2");
	const [a, setA] = useState(0);
	const [b, setB] = useState(1);
	const [n, setN] = useState(3);

	const [data, setData] = useState([]);
	const [xDomain, setXDomain] = useState([]);
	const [yDomain, setYDomain] = useState([]);
	// const [exactResult, setExactResult] = useState(0);
	const [rectangleResult, setRectangleResult] = useState(0);

	useEffect(() => {
		plot();
	}, [a, b, n]);

	const calculateData = function ({ equation, a, b, n }) {
		const h = (b - a) / n;
		let xs = [];
		for (let i = a + h / 2; i < b; i += h) {
			xs.push(i);
		}
		const dataValues = xs.map((x) => ({
			x,
			y: math.evaluate(equation.replace("x", x)),
			y0: 0,
		}));
		return dataValues;
	};

	const calculateRectangleResult = function ({ data, h }) {
		return h * data.map((x) => x.y).reduce((acc = 0, cur) => acc + cur);
	};

	// const calculateExactResult = function ({ equation, a, b }) {
	// 	const integral = equation; //integral(equation, "x");
	// 	const limitA = math.evaluate(integral.replace("x", a));
	// 	const limitB = math.evaluate(integral.replace("x", b));
	// 	return limitB - limitA;
	// };

	const plot = () => {
		const dataValues = calculateData({ equation, a, b, n });
		const minY = dataValues.reduce((acc = { y: Infinity }, cur) =>
			acc.y < cur.y ? acc : cur
		).y;
		const maxY = dataValues.reduce((acc = { y: -Infinity }, cur) =>
			acc.y > cur.y ? acc : cur
		).y;
		const xDomain = [a - 1, b + 1];
		const yDomain = [minY - 1, maxY + 1];
		// const resultExact = calculateExactResult({ equation, a, b });
		const resultRectangle = calculateRectangleResult({
			data: dataValues,
			h: (b - a) / n,
		});

		setData(dataValues);
		setXDomain(xDomain);
		setYDomain(yDomain);
		// setExactResult(resultExact);
		setRectangleResult(resultRectangle.toFixed(2));
	};

	const onSubmitEquation = (e) => {
		plot();
	};

	return (
		<div className="App">
			<div className="Header">
				<h1>Trabajo práctico</h1>
				<h2>Modelado y Simulación</h2>
				<h3>Gaston A. Larriera - L1081874</h3>
			</div>
			<div className="Body">
				<div className="LeftColumn">
					<div>
						<h3>Parametros</h3>
					</div>
					<div>
						<label>A:</label>
						<input
							type="number"
							value={a}
							name="a"
							onChange={(e) => setA(parseInt(e.target.value))}
						></input>
					</div>
					<div>
						<label>B:</label>
						<input
							type="number"
							value={b}
							name="b"
							onChange={(e) => setB(parseInt(e.target.value))}
						></input>
					</div>
					<div>
						<label>N:</label>
						<input
							type="number"
							value={n}
							name="n"
							onChange={(e) => setN(parseInt(e.target.value))}
						></input>
					</div>
					<div>
						<div>
							<label>Equación:</label>
							<input
								id="equation"
								type="text"
								value={equation}
								onChange={(e) => setEquation(e.target.value)}
							/>
						</div>
						<div>
							<button onClick={(e) => onSubmitEquation(e)}>Graficar</button>
						</div>
					</div>
					<div>
						<h3>Resultados</h3>
						{/* <p>Resultado exacto: {exactResult}</p> */}
						<p>Resultado por rectangulos: {rectangleResult}</p>
					</div>
				</div>
				<div className="RigthColumn">
					<XYPlot width={600} height={600} {...{ xDomain, yDomain }}>
						<HorizontalGridLines />
						<VerticalBarSeries data={data} barWidth={0.9} color="orange" />
						<LineSeries data={data} curve={"curveNatural"} color="red" />
						<XAxis on0={true} />
						<YAxis on0={true} />
					</XYPlot>
				</div>
			</div>
		</div>
	);
}

export default App;
