export const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdcToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "year",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "month",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "day",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hour",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minute",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "late",
				"type": "bool"
			}
		],
		"name": "InterestPaymentMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lateFee",
				"type": "uint256"
			}
		],
		"name": "LateFeeApplied",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "yieldPercent",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dueDate",
				"type": "uint256"
			}
		],
		"name": "LoanCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LoanFunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			}
		],
		"name": "LoanRepaid",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timeAdded",
				"type": "uint256"
			}
		],
		"name": "addTime",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "admin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "year",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "month",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "day",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hour",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minute",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "second",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "blocktime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "yieldPercent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dueTime",
				"type": "uint256"
			}
		],
		"name": "createLoanRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "year1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "month1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "day1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "year2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "month2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "day2",
				"type": "uint256"
			}
		],
		"name": "dateDifference",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "monthsDiff",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "daysDiff",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "year",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "month",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "day",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "hour",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minute",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "second",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "blocktime",
						"type": "uint256"
					}
				],
				"internalType": "struct LendingPlatform.Date",
				"name": "date",
				"type": "tuple"
			}
		],
		"name": "dateToTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "fundLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentBlockTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getLoanCurrentDate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "year",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "month",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "day",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "hour",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minute",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "second",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "blocktime",
						"type": "uint256"
					}
				],
				"internalType": "struct LendingPlatform.Date",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "loanCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "loanIndex",
				"type": "uint256"
			}
		],
		"name": "loanDate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "year",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "month",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "day",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "hour",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minute",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "second",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "blocktime",
						"type": "uint256"
					}
				],
				"internalType": "struct LendingPlatform.Date",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "loanDueDate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "year",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "month",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "day",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "hour",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minute",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "second",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "blocktime",
						"type": "uint256"
					}
				],
				"internalType": "struct LendingPlatform.Date",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "loans",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "paidAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "yieldPercent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "offset",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "clientIndex",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "offset",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			}
		],
		"name": "payInterest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bufferPeriod",
				"type": "uint256"
			}
		],
		"name": "payOffLoanAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "payableAdmin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bufferPeriod",
				"type": "uint256"
			}
		],
		"name": "payoffLoan",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sayHello",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "timestampToDate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "year",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "month",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "day",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "hour",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minute",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "second",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "blocktime",
						"type": "uint256"
					}
				],
				"internalType": "struct LendingPlatform.Date",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAdmin",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "updateAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "yieldPercent",
				"type": "uint256"
			}
		],
		"name": "updateLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "updatePayableAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdcToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]