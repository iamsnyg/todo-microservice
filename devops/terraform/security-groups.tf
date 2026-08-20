# ==========================================
# EKS Security Group
# ==========================================

resource "aws_security_group" "eks" {
  name        = "${var.project_name}-eks-sg"
  description = "Security group for EKS cluster"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name    = "${var.project_name}-eks-sg"
    Project = var.project_name
  }
}


# ==========================================
# HTTPS - Internet → EKS Load Balancer
# ==========================================

resource "aws_vpc_security_group_ingress_rule" "eks_https" {
  security_group_id = aws_security_group.eks.id

  description = "Allow HTTPS traffic from Internet"

  ip_protocol = "tcp"
  from_port   = 443
  to_port     = 443

  cidr_ipv4 = "0.0.0.0/0"
}


# ==========================================
# HTTP - Internet → EKS Load Balancer
# ==========================================
# Keep this only if your ingress/load balancer
# needs HTTP for redirect to HTTPS.

resource "aws_vpc_security_group_ingress_rule" "eks_http" {
  security_group_id = aws_security_group.eks.id

  description = "Allow HTTP traffic for HTTPS redirect"

  ip_protocol = "tcp"
  from_port   = 80
  to_port     = 80

  cidr_ipv4 = "0.0.0.0/0"
}


# ==========================================
# SSH
# ==========================================
# Do NOT use 0.0.0.0/0 here.
# Replace YOUR_PUBLIC_IP with your own IP.

resource "aws_vpc_security_group_ingress_rule" "eks_ssh" {
  security_group_id = aws_security_group.eks.id

  description = "SSH access from administrator IP"

  ip_protocol = "tcp"
  from_port   = 22
  to_port     = 22

  cidr_ipv4 = "${var.admin_ip}/32"
}


# ==========================================
# Egress
# ==========================================
# Nodes need outbound connectivity for:
# - ECR
# - AWS APIs
# - DNS
# - package/image downloads
#
# This is outbound traffic, not Internet ingress.

resource "aws_vpc_security_group_egress_rule" "eks_all_outbound" {
  security_group_id = aws_security_group.eks.id

  description = "Allow required outbound traffic"

  ip_protocol = "-1"

  cidr_ipv4 = "0.0.0.0/0"
}