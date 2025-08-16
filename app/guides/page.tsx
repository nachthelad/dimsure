import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  ArrowRight,
  Package,
  TrendingUp,
  Calculator,
  Truck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Packaging & Logistics Guides | Dimsure",
  description:
    "Expert guides on product measurement, packaging optimization, shipping cost reduction, and logistics best practices. Learn from industry professionals.",
  keywords:
    "packaging guides, logistics optimization, product measurement, shipping cost reduction, e-commerce packaging, fulfillment best practices",
  openGraph: {
    title: "Packaging & Logistics Guides | Dimsure",
    description:
      "Expert guides on packaging optimization and logistics best practices",
    type: "website",
  },
};

const guides = [
  {
    id: "accurate-product-measurement",
    title: "How to Measure Product Dimensions Accurately",
    description:
      "Learn professional techniques for measuring products to ensure accurate packaging and shipping calculations.",
    category: "Measurement",
    readTime: "5 min read",
    author: "Dimsure Team",
    icon: Package,
    content: `
# How to Measure Product Dimensions Accurately

Accurate product measurements are crucial for optimizing packaging, reducing shipping costs, and improving customer satisfaction. This comprehensive guide will teach you professional measurement techniques.

## Why Accurate Measurements Matter

- **Cost Savings**: Proper measurements can reduce shipping costs by up to 30%
- **Customer Satisfaction**: Accurate size information reduces returns
- **Inventory Management**: Better space utilization in warehouses
- **Packaging Optimization**: Right-sized packaging reduces waste

## Essential Tools

1. **Digital Calipers** - For precise measurements (±0.1mm accuracy)
2. **Steel Ruler** - For larger items
3. **Measuring Tape** - For oversized products
4. **Digital Scale** - For weight measurements

## Step-by-Step Measurement Process

### 1. Prepare Your Workspace
- Clean, flat surface
- Good lighting
- Remove all packaging materials
- Have measurement tools ready

### 2. Identify the Orientation
- **Length**: Longest dimension
- **Width**: Second longest dimension  
- **Height**: Shortest dimension (usually vertical)

### 3. Measure Each Dimension
- Measure at the widest points
- Include any protruding parts
- Round up to the nearest millimeter
- Take multiple measurements for accuracy

### 4. Document Everything
- Record all three dimensions
- Note any special characteristics
- Take photos for reference
- Include weight if relevant

## Common Mistakes to Avoid

- Measuring compressed packaging instead of actual product
- Ignoring protruding elements (handles, antennas, etc.)
- Not accounting for irregular shapes
- Rounding down instead of up
- Measuring only one sample of variable products

## Best Practices for Different Product Types

### Electronics
- Include cables and accessories
- Measure with protective cases if applicable
- Account for ventilation requirements

### Clothing & Textiles
- Measure when laid flat
- Consider compression for soft goods
- Account for seasonal variations

### Fragile Items
- Include protective packaging in measurements
- Consider minimum safe packaging requirements
- Factor in cushioning materials

## Quality Control Tips

1. **Double-check measurements** - Measure twice, record once
2. **Cross-reference** - Compare with manufacturer specifications
3. **Community verification** - Submit to platforms like Dimsure for validation
4. **Regular calibration** - Ensure your tools are accurate

## Conclusion

Accurate product measurement is a skill that improves with practice. By following these professional techniques, you'll contribute to better logistics efficiency and cost optimization across the supply chain.

Remember: When in doubt, measure again. Accuracy today saves money tomorrow.
    `,
  },
  {
    id: "packaging-optimization",
    title: "Packaging Optimization for E-commerce",
    description:
      "Reduce costs and environmental impact with smart packaging strategies based on accurate product dimensions.",
    category: "Optimization",
    readTime: "7 min read",
    author: "Logistics Expert",
    icon: TrendingUp,
    content: `
# Packaging Optimization for E-commerce

Smart packaging optimization can reduce your shipping costs by 20-40% while improving customer experience and reducing environmental impact.

## The Cost of Poor Packaging

- **Oversized boxes** increase shipping costs exponentially
- **Undersized packaging** leads to damage and returns
- **Wrong materials** waste money and harm the environment
- **Inefficient processes** slow down fulfillment

## Key Optimization Strategies

### 1. Right-Size Your Packaging
Use accurate product dimensions to select optimal box sizes:
- Minimize void space (aim for <20% empty space)
- Consider product protection requirements
- Account for cushioning materials
- Plan for multiple items per shipment

### 2. Implement Dimensional Weight Pricing
Understand how carriers calculate costs:
- **Actual weight** vs **dimensional weight**
- Dimensional factor varies by carrier
- Optimize for the higher of the two weights
- Consider regional variations in pricing

### 3. Standardize Box Sizes
Reduce complexity with a curated selection:
- 5-8 standard sizes cover 80% of products
- Negotiate better rates with fewer SKUs
- Simplify inventory management
- Improve packing efficiency

## Packaging Materials Guide

### Corrugated Cardboard
- **Best for**: Most products
- **Pros**: Recyclable, customizable, cost-effective
- **Cons**: Not waterproof, limited reusability

### Poly Mailers
- **Best for**: Soft goods, non-fragile items
- **Pros**: Lightweight, waterproof, space-efficient
- **Cons**: Not recyclable everywhere, limited protection

### Padded Envelopes
- **Best for**: Small, semi-fragile items
- **Pros**: Built-in protection, lightweight
- **Cons**: Limited size options, higher per-unit cost

## Sustainability Considerations

1. **Material Selection**
   - Choose recyclable materials
   - Consider biodegradable options
   - Minimize plastic usage
   - Use renewable resources

2. **Size Optimization**
   - Reduce material waste
   - Lower transportation emissions
   - Improve space utilization
   - Minimize packaging layers

## Technology Solutions

### Packaging Software
- **3D bin packing algorithms**
- **Cartonization software**
- **Dimensional weight calculators**
- **Cost optimization tools**

### Automated Systems
- **Auto-bagging machines**
- **Box-making equipment**
- **Void-fill dispensers**
- **Packaging verification systems**

## Measuring Success

Track these key metrics:
- **Packaging cost per shipment**
- **Damage rates**
- **Customer satisfaction scores**
- **Environmental impact metrics**
- **Fulfillment speed**

## Implementation Roadmap

### Phase 1: Assessment (Week 1-2)
- Audit current packaging practices
- Analyze cost and damage data
- Identify quick wins

### Phase 2: Optimization (Week 3-6)
- Implement right-sizing strategies
- Standardize box selection
- Train fulfillment team

### Phase 3: Automation (Month 2-3)
- Deploy packaging software
- Consider automated solutions
- Establish monitoring systems

## Conclusion

Packaging optimization is an ongoing process that requires accurate data, smart strategies, and continuous improvement. Start with accurate product dimensions, implement right-sizing strategies, and measure your results.

The investment in optimization pays dividends through reduced costs, improved customer satisfaction, and environmental benefits.
    `,
  },
  {
    id: "shipping-cost-calculator",
    title: "Understanding Shipping Cost Calculations",
    description:
      "Master dimensional weight pricing, zone skipping, and carrier selection to minimize shipping expenses.",
    category: "Logistics",
    readTime: "6 min read",
    author: "Supply Chain Analyst",
    icon: Calculator,
    content: `
# Understanding Shipping Cost Calculations

Shipping costs can make or break your e-commerce profitability. Understanding how carriers calculate rates helps you optimize for minimum costs.

## Dimensional Weight Explained

Carriers charge based on the greater of actual weight or dimensional weight:

**Dimensional Weight = (Length × Width × Height) ÷ Dimensional Factor**

### Dimensional Factors by Carrier:
- **FedEx/UPS Domestic**: 139
- **FedEx/UPS International**: 166
- **USPS**: 166
- **DHL**: 166

### Example Calculation:
Product: 12" × 8" × 6", 2 lbs actual weight
- Dimensional Weight = (12 × 8 × 6) ÷ 139 = 4.1 lbs
- Billable Weight = 4.1 lbs (higher than actual 2 lbs)

## Zone-Based Pricing

Shipping costs increase with distance:

### Zone Structure:
- **Zone 1-2**: Local/regional (lowest cost)
- **Zone 3-4**: Regional extended
- **Zone 5-6**: Cross-country
- **Zone 7-8**: Extended/remote areas

### Optimization Strategies:
1. **Distributed fulfillment** - Multiple warehouses
2. **Zone skipping** - Consolidate shipments
3. **Regional carriers** - Local delivery partners
4. **Hybrid solutions** - Mix of carriers

## Carrier Comparison Framework

### Service Levels:
- **Ground**: 1-5 business days, lowest cost
- **Express**: 1-3 business days, moderate cost  
- **Overnight**: Next day, highest cost

### Carrier Strengths:
- **USPS**: Small packages, rural delivery
- **UPS**: Reliability, tracking, B2B
- **FedEx**: Speed, international, high-value
- **Regional**: Cost-effective, local expertise

## Cost Optimization Strategies

### 1. Package Optimization
- Minimize dimensional weight
- Use appropriate packaging materials
- Consider product bundling
- Implement cube utilization

### 2. Service Selection
- Match service to customer expectations
- Use ground when possible
- Offer shipping options at checkout
- Consider delivery date flexibility

### 3. Negotiation Tactics
- Volume commitments for better rates
- Fuel surcharge caps
- Accessorial fee reductions
- Performance incentives

## Advanced Strategies

### Multi-Carrier Shipping
- **Rate shopping** - Compare real-time rates
- **Service redundancy** - Backup options
- **Performance optimization** - Best carrier per lane
- **Cost averaging** - Spread risk across carriers

### Technology Integration
- **TMS (Transportation Management System)**
- **Multi-carrier APIs**
- **Rate shopping engines**
- **Analytics platforms**

## Hidden Costs to Watch

### Accessorial Charges:
- **Residential delivery** - $4-6 per package
- **Signature required** - $3-5 per package
- **Address correction** - $15-20 per package
- **Fuel surcharges** - 8-15% of base rate

### Mitigation Strategies:
- Validate addresses before shipping
- Offer business delivery when possible
- Negotiate accessorial reductions
- Monitor fuel surcharge trends

## Measuring Performance

### Key Metrics:
- **Cost per shipment** by zone/weight
- **On-time delivery rates** by carrier
- **Damage rates** by service level
- **Customer satisfaction** scores

### Reporting Framework:
- Weekly performance dashboards
- Monthly cost analysis
- Quarterly carrier reviews
- Annual contract negotiations

## Future Trends

### Emerging Technologies:
- **AI-powered optimization**
- **Predictive analytics**
- **Autonomous delivery**
- **Sustainable shipping options**

### Market Changes:
- **Same-day delivery growth**
- **Sustainability requirements**
- **Peak season capacity**
- **Rural delivery challenges**

## Conclusion

Mastering shipping cost calculations requires understanding dimensional weight, zone-based pricing, and carrier differences. Use this knowledge to optimize your packaging, select appropriate services, and negotiate better rates.

Remember: Small optimizations compound over thousands of shipments. Start with accurate measurements and build from there.
    `,
  },
  {
    id: "logistics-best-practices",
    title: "E-commerce Logistics Best Practices",
    description:
      "Comprehensive guide to optimizing your fulfillment operations, from inventory management to last-mile delivery.",
    category: "Operations",
    readTime: "8 min read",
    author: "Operations Manager",
    icon: Truck,
    content: `
# E-commerce Logistics Best Practices

Efficient logistics operations are the backbone of successful e-commerce. This guide covers proven strategies for optimizing your entire fulfillment process.

## Foundation: Accurate Data

Everything starts with accurate product information:
- **Precise dimensions** for packaging optimization
- **Accurate weights** for shipping calculations  
- **Detailed specifications** for handling requirements
- **High-quality images** for pick accuracy

## Inventory Management Excellence

### ABC Analysis
Categorize products by importance:
- **A Items** (20% of SKUs, 80% of revenue): Prime locations, high stock
- **B Items** (30% of SKUs, 15% of revenue): Standard management
- **C Items** (50% of SKUs, 5% of revenue): Minimal stock, consider dropship

### Demand Forecasting
- Historical sales analysis
- Seasonal trend identification
- Market trend integration
- Safety stock optimization

### Cycle Counting
- Daily counts for A items
- Weekly counts for B items  
- Monthly counts for C items
- Exception-based investigations

## Warehouse Layout Optimization

### Zone Design
1. **Receiving Zone**: Inspection, put-away staging
2. **Storage Zones**: Fast/medium/slow movers
3. **Picking Zones**: Optimized for order profiles
4. **Packing Stations**: Right-sized for volume
5. **Shipping Dock**: Carrier-specific staging

### Slotting Strategy
- **Golden Zone**: Eye-level, arm's reach
- **Velocity-based**: Fast movers in prime locations
- **Cube utilization**: Maximize space efficiency
- **Pick path optimization**: Minimize travel time

## Order Fulfillment Process

### Order Processing
1. **Order validation** - Payment, inventory, address
2. **Order routing** - Warehouse selection, priority
3. **Pick list generation** - Optimized sequences
4. **Quality control** - Accuracy verification

### Picking Strategies
- **Single order picking**: Simple, flexible
- **Batch picking**: Efficient for similar orders
- **Zone picking**: Specialized areas
- **Wave picking**: Scheduled releases

### Packing Optimization
- **Right-sized packaging** based on dimensions
- **Automated void fill** for protection
- **Branded experience** for customer delight
- **Sustainability focus** for environmental impact

## Technology Integration

### Warehouse Management System (WMS)
Core capabilities:
- Real-time inventory tracking
- Pick path optimization
- Labor management
- Performance analytics

### Integration Points:
- **E-commerce platform** - Order sync
- **ERP system** - Financial integration
- **Shipping software** - Rate shopping
- **Analytics platform** - Performance monitoring

## Carrier Management

### Multi-Carrier Strategy
Benefits:
- **Rate optimization** through competition
- **Service redundancy** for reliability
- **Geographic coverage** optimization
- **Peak season capacity** management

### Performance Monitoring
Track key metrics:
- **On-time delivery** rates by carrier
- **Damage rates** by service level
- **Cost per shipment** trends
- **Customer satisfaction** scores

## Quality Control Systems

### Incoming Inspection
- **Quantity verification** against PO
- **Quality assessment** for defects
- **Dimension validation** for accuracy
- **Photo documentation** for records

### Pick Accuracy
- **Barcode scanning** for verification
- **Weight validation** at pack stations
- **Random quality audits** 
- **Error root cause analysis**

### Damage Prevention
- **Proper handling training**
- **Appropriate packaging materials**
- **Environmental controls** (temperature, humidity)
- **Damage tracking and analysis**

## Performance Metrics

### Operational KPIs
- **Order accuracy**: Target >99.5%
- **Pick productivity**: Orders per hour
- **Inventory accuracy**: Cycle count results
- **Damage rates**: <0.5% of shipments

### Financial KPIs  
- **Cost per shipment**: All-in fulfillment cost
- **Inventory turns**: Efficiency measure
- **Carrying costs**: Storage and handling
- **Labor productivity**: Revenue per FTE

### Customer KPIs
- **Order cycle time**: Order to ship
- **Delivery performance**: On-time rates
- **Return rates**: Quality indicator
- **Customer satisfaction**: Survey scores

## Continuous Improvement

### Lean Principles
- **Value stream mapping** - Identify waste
- **5S methodology** - Workplace organization
- **Kaizen events** - Continuous improvement
- **Root cause analysis** - Problem solving

### Technology Adoption
- **Automation opportunities** - ROI analysis
- **AI/ML applications** - Predictive analytics
- **IoT sensors** - Real-time monitoring
- **Robotics integration** - Labor augmentation

## Scaling Strategies

### Growth Planning
- **Capacity modeling** for demand growth
- **Technology roadmap** for capabilities
- **Staffing plans** for seasonal peaks
- **Facility expansion** strategies

### Network Optimization
- **Hub and spoke** vs **distributed** models
- **3PL partnerships** for flexibility
- **Cross-docking** for efficiency
- **Regional fulfillment** for speed

## Risk Management

### Business Continuity
- **Disaster recovery** plans
- **Backup facilities** arrangements
- **Supplier diversification**
- **Insurance coverage** optimization

### Compliance Requirements
- **Safety regulations** (OSHA)
- **Environmental standards**
- **Industry certifications**
- **International trade** requirements

## Conclusion

Excellence in e-commerce logistics requires attention to detail, continuous improvement, and strategic technology adoption. Start with accurate data, optimize your processes, and measure everything.

Remember: Logistics is not just about moving products—it's about creating competitive advantage through superior customer experience and operational efficiency.

The companies that master these fundamentals will thrive in the increasingly competitive e-commerce landscape.
    `,
  },
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Packaging & Logistics Guides
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert guides and best practices for product measurement, packaging
          optimization, shipping cost reduction, and logistics excellence.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <Link key={guide.id} href={`/guides/${guide.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{guide.category}</Badge>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {guide.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {guide.author}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* CTA Section */}
      <Card className="mt-12">
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Ready to Optimize Your Operations?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start by getting accurate product dimensions for your inventory.
            Join thousands of businesses using Dimsure to optimize their
            packaging and logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Search Product Dimensions
            </Link>
            <Link
              href="/add-product"
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
            >
              Contribute Data
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
