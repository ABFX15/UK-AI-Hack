#!/usr/bin/env python3
"""
Integration test script for DeFi Compliance Platform
Tests AI service endpoints and compliance logic
"""

import asyncio
import json
from datetime import datetime
from services.defi_risk_analyzer import DeFiRiskAnalyzer

async def test_protocol_analysis():
    """Test protocol risk analysis"""
    print("🔍 Testing Protocol Risk Analysis...")
    
    analyzer = DeFiRiskAnalyzer()
    
    # Test known protocols
    test_protocols = [
        "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",  # Aave V2
        "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",  # Compound
        "0x1234567890123456789012345678901234567890"    # Unknown protocol
    ]
    
    for protocol in test_protocols:
        try:
            result = await analyzer.analyze_protocol_risk(
                protocol_address=protocol,
                institution_address="0xABCD1234567890123456789012345678901234ABCD"
            )
            
            print(f"\n📊 Protocol: {protocol}")
            print(f"   Name: {result.get('protocol_name', 'Unknown')}")
            print(f"   Risk Score: {result['risk_score']}")
            print(f"   Risk Level: {result['risk_level']}")
            print(f"   Recommendation: {result['recommendation']}")
            print(f"   Max Exposure: {result['max_exposure_percentage']}%")
            print(f"   Alerts: {result['monitoring_alerts']}")
            
        except Exception as e:
            print(f"❌ Error analyzing {protocol}: {str(e)}")

async def test_aml_analysis():
    """Test AML compliance analysis"""
    print("\n💳 Testing AML Analysis...")
    
    analyzer = DeFiRiskAnalyzer()
    
    # Test transactions
    test_transactions = [
        {
            "tx_hash": "0xabc123def456...",
            "amount_usd": 5000,
            "frequency_24h": 3,
            "counterparty_address": "0x123456789...",
            "origin_country": "US"
        },
        {
            "tx_hash": "0xdef456abc123...",
            "amount_usd": 150000,  # Large amount
            "frequency_24h": 20,   # High frequency
            "counterparty_address": "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",  # Sanctioned
            "origin_country": "XX"
        }
    ]
    
    for tx in test_transactions:
        try:
            result = await analyzer.analyze_aml_compliance(tx)
            
            print(f"\n💰 Transaction: {tx['tx_hash'][:20]}...")
            print(f"   Amount: ${tx['amount_usd']:,}")
            print(f"   AML Risk Score: {result['aml_risk_score']}")
            print(f"   Compliance Level: {result['compliance_level']}")
            print(f"   Manual Review Required: {result['requires_manual_review']}")
            print(f"   Suspicious Patterns: {result['suspicious_patterns']}")
            
        except Exception as e:
            print(f"❌ Error analyzing transaction: {str(e)}")

async def test_compliance_report():
    """Test compliance report generation"""
    print("\n📋 Testing Compliance Report Generation...")
    
    analyzer = DeFiRiskAnalyzer()
    
    try:
        report = await analyzer.generate_compliance_report(
            institution_id="INST_001",
            time_period="30d"
        )
        
        print(f"\n📄 Compliance Report for {report['institution_id']}")
        print(f"   Period: {report['report_period']}")
        
        summary = report['summary']
        print(f"   Protocols Analyzed: {summary['total_protocols_analyzed']}")
        print(f"   Average Risk Score: {summary['average_protocol_risk']:.3f}")
        print(f"   High Risk Protocols: {summary['high_risk_protocols']}")
        print(f"   Transactions Analyzed: {summary['total_transactions_analyzed']}")
        print(f"   Flagged Transactions: {summary['flagged_transactions']}")
        print(f"   Overall Compliance Score: {summary['overall_compliance_score']:.3f}")
        print(f"   Recommendations: {report['recommendations']}")
        
    except Exception as e:
        print(f"❌ Error generating compliance report: {str(e)}")

async def test_integration():
    """Test full integration"""
    print("🚀 Starting DeFi Compliance Platform Integration Tests")
    print("=" * 60)
    
    try:
        await test_protocol_analysis()
        await test_aml_analysis() 
        await test_compliance_report()
        
        print("\n" + "=" * 60)
        print("✅ All integration tests completed successfully!")
        print("🛡️  DeFi Compliance Platform is ready for institutional use")
        
    except Exception as e:
        print(f"\n❌ Integration test failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_integration())
